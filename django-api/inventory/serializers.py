from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from .models import Category, Supplier, Product, PurchaseOrder, PurchaseOrderItem, StockAlert


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.ReadOnlyField()

    class Meta:
        model = Category
        fields = ["id", "name", "description", "product_count", "created_at", "updated_at"]


class SupplierSerializer(serializers.ModelSerializer):
    products_supplied = serializers.ReadOnlyField()

    class Meta:
        model = Supplier
        fields = ["id", "name", "email", "phone", "address", "status", "products_supplied", "created_at", "updated_at"]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    supplier_name = serializers.CharField(source="supplier.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "sku", "category", "category_name",
            "supplier", "supplier_name", "price", "cost_price",
            "stock", "min_stock", "status", "last_updated", "created_at",
        ]
        read_only_fields = ["status", "last_updated"]


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    total = serializers.ReadOnlyField()

    class Meta:
        model = PurchaseOrderItem
        fields = ["id", "product", "product_name", "quantity", "unit_price", "total"]


def apply_purchase_order_delivery(order):
    with transaction.atomic():
        for item in order.order_items.select_related("product"):
            product = item.product
            product.stock += item.quantity
            product.save()


def generate_order_number():
    year = timezone.now().year
    prefix = f"PO-{year}-"
    last = (
        PurchaseOrder.objects.filter(order_number__startswith=prefix)
        .order_by("-order_number")
        .first()
    )
    if last:
        try:
            seq = int(last.order_number.rsplit("-", 1)[-1]) + 1
        except ValueError:
            seq = 1
    else:
        seq = 1
    return f"{prefix}{seq:03d}"


class PurchaseOrderItemWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = ["product", "quantity", "unit_price"]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")
        return value


class PurchaseOrderSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.name", read_only=True)
    order_items = PurchaseOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = [
            "id", "order_number", "supplier", "supplier_name",
            "status", "total_amount", "items_count",
            "order_date", "expected_date", "order_items", "created_at",
        ]


class PurchaseOrderCreateSerializer(serializers.ModelSerializer):
    order_items = PurchaseOrderItemWriteSerializer(many=True)

    class Meta:
        model = PurchaseOrder
        fields = ["id", "supplier", "expected_date", "order_items"]

    def validate_order_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one line item is required.")
        return value

    def validate(self, attrs):
        supplier = attrs["supplier"]
        for item in attrs["order_items"]:
            product = item["product"]
            if product.supplier_id and product.supplier_id != supplier.id:
                raise serializers.ValidationError(
                    {"order_items": f"{product.name} is not supplied by {supplier.name}."}
                )
        return attrs

    def create(self, validated_data):
        items_data = validated_data.pop("order_items")
        total = sum(
            Decimal(item["quantity"]) * item["unit_price"] for item in items_data
        )
        with transaction.atomic():
            order = PurchaseOrder.objects.create(
                order_number=generate_order_number(),
                total_amount=total,
                items_count=len(items_data),
                **validated_data,
            )
            for item_data in items_data:
                PurchaseOrderItem.objects.create(order=order, **item_data)
        return order


class PurchaseOrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = ["status", "expected_date"]

    def update(self, instance, validated_data):
        old_status = instance.status
        instance = super().update(instance, validated_data)
        if old_status != "delivered" and instance.status == "delivered":
            apply_purchase_order_delivery(instance)
        return instance


class StockAlertSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = StockAlert
        fields = ["id", "product", "product_name", "alert_type", "message", "is_resolved", "created_at"]
