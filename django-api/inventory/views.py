from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, F, Count
from .models import Category, Supplier, Product, PurchaseOrder, StockAlert
from .serializers import (
    CategorySerializer, SupplierSerializer, ProductSerializer,
    PurchaseOrderSerializer, StockAlertSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    search_fields = ["name"]


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    search_fields = ["name", "email"]
    filterset_fields = ["status"]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category", "supplier").all()
    serializer_class = ProductSerializer
    search_fields = ["name", "sku"]
    filterset_fields = ["status", "category"]
    ordering_fields = ["name", "price", "stock", "created_at"]

    @action(detail=False, methods=["get"])
    def dashboard_stats(self, request):
        products = Product.objects.all()
        total_value = products.aggregate(val=Sum(F("price") * F("stock")))["val"] or 0
        total_cost = products.aggregate(val=Sum(F("cost_price") * F("stock")))["val"] or 0
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
    queryset = PurchaseOrder.objects.select_related("supplier").prefetch_related("order_items").all()
    serializer_class = PurchaseOrderSerializer
    search_fields = ["order_number"]
    filterset_fields = ["status"]


class StockAlertViewSet(viewsets.ModelViewSet):
    queryset = StockAlert.objects.select_related("product").all()
    serializer_class = StockAlertSerializer
    filterset_fields = ["alert_type", "is_resolved"]

    @action(detail=True, methods=["post"])
    def resolve(self, request, pk=None):
        alert = self.get_object()
        alert.is_resolved = True
        alert.save()
        return Response({"status": "resolved"})
