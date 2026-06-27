import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts, createProduct, updateProduct, deleteProduct,
  fetchSuppliers, createSupplier, updateSupplier, deleteSupplier,
  fetchCategories, createCategory, updateCategory, deleteCategory,
  fetchPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder,
  fetchStockAlerts, fetchDashboardStats, fetchAnalyticsData,
  type CreatePurchaseOrderPayload,
} from "../lib/api";
import type { Product, Supplier, Category, PurchaseOrder } from "./../lib/mock-data";

// ---- Products ----
export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: fetchProducts });
}
export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Omit<Product, "id" | "status" | "lastUpdated">) => createProduct(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stockAlerts"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => updateProduct(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stockAlerts"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stockAlerts"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

// ---- Suppliers ----
export function useSuppliers() {
  return useQuery({ queryKey: ["suppliers"], queryFn: fetchSuppliers });
}
export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (s: Omit<Supplier, "id" | "productsSupplied">) => createSupplier(s),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["suppliers"] }),
  });
}
export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supplier> }) => updateSupplier(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["suppliers"] }),
  });
}
export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["suppliers"] }),
  });
}

// ---- Categories ----
export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
}
export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (c: Omit<Category, "id" | "productCount">) => createCategory(c),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}
export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => updateCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}
export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

// ---- Purchase Orders ----
export function usePurchaseOrders() {
  return useQuery({ queryKey: ["purchaseOrders"], queryFn: fetchPurchaseOrders });
}
export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePurchaseOrderPayload) => createPurchaseOrder(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchaseOrders"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
export function useUpdatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dbId, data }: { dbId: string; data: { status?: PurchaseOrder["status"]; expectedDate?: string } }) =>
      updatePurchaseOrder(dbId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchaseOrders"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stockAlerts"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}
export function useDeletePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dbId: string) => deletePurchaseOrder(dbId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchaseOrders"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

// ---- Stock Alerts ----
export function useStockAlerts() {
  return useQuery({ queryKey: ["stockAlerts"], queryFn: fetchStockAlerts });
}

// ---- Dashboard ----
export function useDashboardStats() {
  return useQuery({ queryKey: ["dashboardStats"], queryFn: fetchDashboardStats });
}

// ---- Analytics ----
export function useAnalyticsData() {
  return useQuery({ queryKey: ["analytics"], queryFn: fetchAnalyticsData });
}
