from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import DecimalField, ExpressionWrapper, F, Sum
from .models import Category, Supplier, Product, PurchaseOrder, StockAlert
from .serializers import (
    CategorySerializer, SupplierSerializer, ProductSerializer,
    PurchaseOrderSerializer, PurchaseOrderCreateSerializer, PurchaseOrderUpdateSerializer,
    StockAlertSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    search_fields = ["name"]


class SupplierViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    search_fields = ["name", "email"]
    filterset_fields = ["status"]


class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.select_related("category", "supplier").all()
    serializer_class = ProductSerializer
    search_fields = ["name", "sku"]
    filterset_fields = ["status", "category"]
    ordering_fields = ["name", "price", "stock", "created_at"]

    @action(detail=False, methods=["get"])
    def dashboard_stats(self, request):
        products = Product.objects.all()
        inventory_value = ExpressionWrapper(
            F("price") * F("stock"),
            output_field=DecimalField(max_digits=14, decimal_places=2),
        )
        cost_value = ExpressionWrapper(
            F("cost_price") * F("stock"),
            output_field=DecimalField(max_digits=14, decimal_places=2),
        )
        total_value = products.aggregate(val=Sum(inventory_value))["val"] or 0
        total_cost = products.aggregate(val=Sum(cost_value))["val"] or 0
        return Response({
            "total_products": products.count(),
            "total_categories": Category.objects.count(),
            "total_suppliers": Supplier.objects.filter(status="active").count(),
            "low_stock_count": products.filter(status="low-stock").count(),
            "out_of_stock_count": products.filter(status="out-of-stock").count(),
            "total_inventory_value": float(total_value),
            "total_cost_value": float(total_cost),
            "potential_profit": float(total_value - total_cost),
        })

    @action(detail=False, methods=["get"])
    def stock_by_category(self, request):
        data = (
            Category.objects.annotate(total_stock=Sum("products__stock"))
            .values("name", "total_stock")
            .order_by("-total_stock")
        )
        return Response(data)


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = PurchaseOrder.objects.select_related("supplier").prefetch_related("order_items").all()
    serializer_class = PurchaseOrderSerializer
    search_fields = ["order_number"]
    filterset_fields = ["status"]

    def get_serializer_class(self):
        if self.action == "create":
            return PurchaseOrderCreateSerializer
        if self.action in ("update", "partial_update"):
            return PurchaseOrderUpdateSerializer
        return PurchaseOrderSerializer


class StockAlertViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = StockAlert.objects.select_related("product").all()
    serializer_class = StockAlertSerializer
    filterset_fields = ["alert_type", "is_resolved"]

    def list(self, request, *args, **kwargs):
        products = Product.objects.filter(
            status__in=["low-stock", "out-of-stock"]
        ).order_by("status", "name")
        data = [
            {
                "id": product.id,
                "product": product.id,
                "product_name": product.name,
                "alert_type": product.status,
                "message": f"{product.name} is {product.get_status_display().lower()}",
                "is_resolved": False,
                "created_at": product.last_updated,
            }
            for product in products
        ]
        return Response(data)

    @action(detail=True, methods=["post"])
    def resolve(self, request, pk=None):
        alert = self.get_object()
        alert.is_resolved = True
        alert.save()
        return Response({"status": "resolved"})
