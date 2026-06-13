from django.contrib import admin
from .models import Category, Supplier, Product, PurchaseOrder, PurchaseOrderItem, StockAlert

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "product_count", "created_at"]
    search_fields = ["name"]

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "phone", "status"]
    list_filter = ["status"]
    search_fields = ["name", "email"]

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "sku", "category", "price", "stock", "status"]
    list_filter = ["status", "category"]
    search_fields = ["name", "sku"]

class PurchaseOrderItemInline(admin.TabularInline):
    model = PurchaseOrderItem
    extra = 1

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ["order_number", "supplier", "status", "total_amount", "order_date"]
    list_filter = ["status"]
    inlines = [PurchaseOrderItemInline]

@admin.register(StockAlert)
class StockAlertAdmin(admin.ModelAdmin):
    list_display = ["product", "alert_type", "is_resolved", "created_at"]
    list_filter = ["alert_type", "is_resolved"]
