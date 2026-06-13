from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"categories", views.CategoryViewSet)
router.register(r"suppliers", views.SupplierViewSet)
router.register(r"products", views.ProductViewSet)
router.register(r"purchase-orders", views.PurchaseOrderViewSet)
router.register(r"stock-alerts", views.StockAlertViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
