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


class StockAlertSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = StockAlert
        fields = ["id", "product", "product_name", "alert_type", "message", "is_resolved", "created_at"]
