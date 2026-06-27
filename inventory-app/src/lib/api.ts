import {
  products as mockProducts,
  suppliers as mockSuppliers,
  categories as mockCategories,
  purchaseOrders as mockOrders,
  stockAlerts as mockAlerts,
  monthlySalesData as mockSalesData,
  categoryStockData as mockCategoryStock,
  type Product,
  type Supplier,
  type Category,
  type PurchaseOrder,
  type StockAlert,
} from "./mock-data";
import { clearAuth, getAccessToken, refreshAccessToken } from "./auth-api";

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const CHART_COLORS = [
  "hsl(220,70%,45%)",
  "hsl(36,95%,52%)",
  "hsl(142,70%,40%)",
  "hsl(280,60%,50%)",
  "hsl(0,72%,51%)",
];

function listFromResponse<T>(data: T[] | { results?: T[] }): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const fetchWithToken = (token: string | null) =>
    fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && token !== "mock-access-token" ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

  let res = await fetchWithToken(getAccessToken());

  if (res.status === 401) {
    try {
      const token = await refreshAccessToken();
      res = await fetchWithToken(token);
    } catch {
      clearAuth();
      throw new Error("Unauthorized");
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      (data && (data.detail || data.message)) ||
      `API ${res.status}`;
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

// ---------- Products ----------
export async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await apiFetch<any[] | { results: any[] }>("/products/");
    return listFromResponse(data).map((p) => ({
      id: String(p.id),
      name: p.name,
      sku: p.sku,
      category: p.category_name || "",
      price: Number(p.price),
      costPrice: Number(p.cost_price),
      stock: p.stock,
      minStock: p.min_stock,
      supplier: p.supplier_name || "",
      status: p.status as Product["status"],
      lastUpdated: p.last_updated,
    }));
  } catch {
    return mockProducts;
  }
}

export async function createProduct(product: Omit<Product, "id" | "status" | "lastUpdated">): Promise<Product> {
  try {
    const p = await apiFetch<any>("/products/", {
      method: "POST",
      body: JSON.stringify({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        cost_price: product.costPrice,
        stock: product.stock,
        min_stock: product.minStock,
        supplier: product.supplier,
      }),
    });
    return { ...product, id: String(p.id), status: p.status, lastUpdated: p.last_updated };
  } catch {
    const stock = product.stock;
    const status: Product["status"] = stock === 0 ? "out-of-stock" : stock <= product.minStock ? "low-stock" : "in-stock";
    return { ...product, id: Date.now().toString(), status, lastUpdated: new Date().toISOString().split("T")[0] };
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  try {
    const body: any = {};
    if (product.name) body.name = product.name;
    if (product.sku) body.sku = product.sku;
    if (product.category) body.category = product.category;
    if (product.price !== undefined) body.price = product.price;
    if (product.costPrice !== undefined) body.cost_price = product.costPrice;
    if (product.stock !== undefined) body.stock = product.stock;
    if (product.minStock !== undefined) body.min_stock = product.minStock;
    if (product.supplier) body.supplier = product.supplier;
    const p = await apiFetch<any>(`/products/${id}/`, { method: "PATCH", body: JSON.stringify(body) });
    return {
      id: String(p.id), name: p.name, sku: p.sku, category: p.category_name || "",
      price: Number(p.price), costPrice: Number(p.cost_price), stock: p.stock,
      minStock: p.min_stock, supplier: p.supplier_name || "", status: p.status, lastUpdated: p.last_updated,
    };
  } catch {
    return product as Product;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await apiFetch(`/products/${id}/`, { method: "DELETE" });
  } catch {
    // fallback: handled in UI state
  }
}

// ---------- Suppliers ----------
export async function fetchSuppliers(): Promise<Supplier[]> {
  try {
    const data = await apiFetch<any[] | { results: any[] }>("/suppliers/");
    return listFromResponse(data).map((s) => ({
      id: String(s.id),
      name: s.name,
      email: s.email,
      phone: s.phone,
      address: s.address,
      productsSupplied: s.products_supplied || 0,
      status: s.status as Supplier["status"],
    }));
  } catch {
    return mockSuppliers;
  }
}

export async function createSupplier(supplier: Omit<Supplier, "id" | "productsSupplied">): Promise<Supplier> {
  try {
    const s = await apiFetch<any>("/suppliers/", { method: "POST", body: JSON.stringify(supplier) });
    return { ...supplier, id: String(s.id), productsSupplied: 0 };
  } catch {
    return { ...supplier, id: Date.now().toString(), productsSupplied: 0 };
  }
}

export async function updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier> {
  try {
    const s = await apiFetch<any>(`/suppliers/${id}/`, { method: "PATCH", body: JSON.stringify(supplier) });
    return {
      id: String(s.id), name: s.name, email: s.email, phone: s.phone,
      address: s.address, productsSupplied: s.products_supplied || 0, status: s.status,
    };
  } catch {
    return supplier as Supplier;
  }
}

export async function deleteSupplier(id: string): Promise<void> {
  try {
    await apiFetch(`/suppliers/${id}/`, { method: "DELETE" });
  } catch {
    // fallback
  }
}

// ---------- Categories ----------
export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await apiFetch<any[] | { results: any[] }>("/categories/");
    return listFromResponse(data).map((c) => ({
      id: String(c.id),
      name: c.name,
      description: c.description,
      productCount: c.product_count || 0,
    }));
  } catch {
    return mockCategories;
  }
}

export async function createCategory(cat: Omit<Category, "id" | "productCount">): Promise<Category> {
  try {
    const c = await apiFetch<any>("/categories/", { method: "POST", body: JSON.stringify(cat) });
    return { ...cat, id: String(c.id), productCount: 0 };
  } catch {
    return { ...cat, id: Date.now().toString(), productCount: 0 };
  }
}

export async function updateCategory(id: string, cat: Partial<Category>): Promise<Category> {
  try {
    const c = await apiFetch<any>(`/categories/${id}/`, { method: "PATCH", body: JSON.stringify(cat) });
    return { id: String(c.id), name: c.name, description: c.description, productCount: c.product_count || 0 };
  } catch {
    return cat as Category;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await apiFetch(`/categories/${id}/`, { method: "DELETE" });
  } catch {
    // fallback
  }
}

// ---------- Purchase Orders ----------
function mapPurchaseOrder(o: any): PurchaseOrder {
  return {
    id: o.order_number || String(o.id),
    dbId: String(o.id),
    supplier: o.supplier_name || "",
    supplierId: o.supplier != null ? String(o.supplier) : undefined,
    date: o.order_date,
    expectedDate: o.expected_date || undefined,
    items: o.items_count,
    total: Number(o.total_amount),
    status: o.status as PurchaseOrder["status"],
  };
}

export interface CreatePurchaseOrderPayload {
  supplierId: string;
  expectedDate?: string;
  orderItems: { productId: string; quantity: number; unitPrice: number }[];
}

export async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  try {
    const data = await apiFetch<any[] | { results: any[] }>("/purchase-orders/");
    return listFromResponse(data).map(mapPurchaseOrder);
  } catch {
    return mockOrders;
  }
}

export async function createPurchaseOrder(payload: CreatePurchaseOrderPayload): Promise<PurchaseOrder> {
  try {
    const o = await apiFetch<any>("/purchase-orders/", {
      method: "POST",
      body: JSON.stringify({
        supplier: Number(payload.supplierId),
        expected_date: payload.expectedDate || null,
        order_items: payload.orderItems.map((item) => ({
          product: Number(item.productId),
          quantity: item.quantity,
          unit_price: item.unitPrice,
        })),
      }),
    });
    return mapPurchaseOrder(o);
  } catch {
    const supplierName = mockSuppliers.find((s) => s.id === payload.supplierId)?.name || "";
    const total = payload.orderItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    return {
      id: `PO-${Date.now()}`,
      supplier: supplierName,
      supplierId: payload.supplierId,
      date: new Date().toISOString().split("T")[0],
      expectedDate: payload.expectedDate,
      items: payload.orderItems.length,
      total,
      status: "pending",
    };
  }
}

export async function updatePurchaseOrder(
  dbId: string,
  data: { status?: PurchaseOrder["status"]; expectedDate?: string }
): Promise<PurchaseOrder> {
  try {
    const body: Record<string, string> = {};
    if (data.status) body.status = data.status;
    if (data.expectedDate) body.expected_date = data.expectedDate;
    const o = await apiFetch<any>(`/purchase-orders/${dbId}/`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    return mapPurchaseOrder(o);
  } catch {
    return {
      id: dbId,
      dbId,
      supplier: "",
      date: new Date().toISOString().split("T")[0],
      items: 0,
      total: 0,
      status: data.status || "pending",
    };
  }
}

export async function deletePurchaseOrder(dbId: string): Promise<void> {
  try {
    await apiFetch(`/purchase-orders/${dbId}/`, { method: "DELETE" });
  } catch {
    // fallback handled in UI
  }
}

// ---------- Stock Alerts ----------
function alertsFromProducts(products: Product[]): StockAlert[] {
  return products
    .filter((product) => product.status === "low-stock" || product.status === "out-of-stock")
    .map((product) => ({
      id: product.id,
      product: product.name,
      sku: product.sku,
      currentStock: product.stock,
      minStock: product.minStock,
      type: product.status === "out-of-stock" ? ("out" as const) : ("low" as const),
    }))
    .sort((a, b) => (a.type === "out" ? 0 : 1) - (b.type === "out" ? 0 : 1) || a.product.localeCompare(b.product));
}

export async function fetchStockAlerts(): Promise<StockAlert[]> {
  try {
    const products = await fetchProducts();
    return alertsFromProducts(products);
  } catch {
    return mockAlerts;
  }
}

// ---------- Dashboard Stats ----------
export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  totalCost: number;
  potentialProfit: number;
  profitMargin: number;
  stockAlerts: number;
  activeSuppliers: number;
  totalUnits: number;
}

export interface InventoryMetrics {
  totalValue: number;
  totalCost: number;
  potentialProfit: number;
  profitMargin: number;
  markup: number;
  totalUnits: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  avgUnitProfit: number;
}

export function computeInventoryMetrics(products: Product[]): InventoryMetrics {
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  const totalCost = products.reduce((sum, product) => sum + product.costPrice * product.stock, 0);
  const potentialProfit = totalValue - totalCost;
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const inStockCount = products.filter((product) => product.status === "in-stock").length;
  const lowStockCount = products.filter((product) => product.status === "low-stock").length;
  const outOfStockCount = products.filter((product) => product.status === "out-of-stock").length;

  return {
    totalValue,
    totalCost,
    potentialProfit,
    profitMargin: totalValue > 0 ? (potentialProfit / totalValue) * 100 : 0,
    markup: totalCost > 0 ? (potentialProfit / totalCost) * 100 : 0,
    totalUnits,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    avgUnitProfit: totalUnits > 0 ? potentialProfit / totalUnits : 0,
  };
}

function statsFromProducts(products: Product[], suppliers: Supplier[]): DashboardStats {
  const metrics = computeInventoryMetrics(products);

  return {
    totalProducts: products.length,
    totalValue: metrics.totalValue,
    totalCost: metrics.totalCost,
    potentialProfit: metrics.potentialProfit,
    profitMargin: metrics.profitMargin,
    stockAlerts: metrics.lowStockCount + metrics.outOfStockCount,
    activeSuppliers: suppliers.filter((supplier) => supplier.status === "active").length,
    totalUnits: metrics.totalUnits,
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const [products, suppliers] = await Promise.all([fetchProducts(), fetchSuppliers()]);
    return statsFromProducts(products, suppliers);
  } catch {
    return statsFromProducts(mockProducts, mockSuppliers);
  }
}

// ---------- Analytics ----------
export interface ProductProfitRow {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  costPrice: number;
  retailValue: number;
  costValue: number;
  profit: number;
  margin: number;
}

export interface CategoryValueRow {
  category: string;
  units: number;
  retail: number;
  cost: number;
  profit: number;
  margin: number;
  fill: string;
}

export interface AnalyticsData {
  totalValue: number;
  totalCost: number;
  potentialProfit: number;
  profitMargin: number;
  markup: number;
  avgUnitProfit: number;
  orderValue: number;
  openOrderValue: number;
  deliveredOrderValue: number;
  stockHealth: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
    inStockPercent: number;
  };
  monthlySales: typeof mockSalesData;
  categoryStock: typeof mockCategoryStock;
  categoryValue: CategoryValueRow[];
  topProductsByValue: ProductProfitRow[];
  topProductsByProfit: ProductProfitRow[];
  valueComparison: { name: string; retail: number; cost: number; profit: number }[];
}

function monthlyOrderData(orders: PurchaseOrder[]) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return {
      key,
      month: monthNames[date.getMonth()],
      revenue: 0,
      orders: 0,
    };
  });

  const byKey = new Map(months.map((month) => [month.key, month]));
  orders.forEach((order) => {
    if (order.status === "cancelled") return;
    const date = new Date(order.date);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const bucket = byKey.get(key);
    if (!bucket) return;
    bucket.revenue += order.total;
    bucket.orders += 1;
  });

  return months.map(({ month, revenue, orders }) => ({ month, revenue, orders }));
}

function productProfitRow(product: Product): ProductProfitRow {
  const retailValue = product.price * product.stock;
  const costValue = product.costPrice * product.stock;
  const profit = retailValue - costValue;
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    stock: product.stock,
    price: product.price,
    costPrice: product.costPrice,
    retailValue,
    costValue,
    profit,
    margin: retailValue > 0 ? (profit / retailValue) * 100 : 0,
  };
}

function categoryValueFromProducts(products: Product[]): CategoryValueRow[] {
  const grouped = new Map<string, { units: number; retail: number; cost: number }>();
  products.forEach((product) => {
    const category = product.category || "Uncategorized";
    const current = grouped.get(category) ?? { units: 0, retail: 0, cost: 0 };
    current.units += product.stock;
    current.retail += product.price * product.stock;
    current.cost += product.costPrice * product.stock;
    grouped.set(category, current);
  });

  return [...grouped.entries()]
    .map(([category, values], index) => {
      const profit = values.retail - values.cost;
      return {
        category,
        units: values.units,
        retail: values.retail,
        cost: values.cost,
        profit,
        margin: values.retail > 0 ? (profit / values.retail) * 100 : 0,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      };
    })
    .sort((a, b) => b.retail - a.retail);
}

function buildAnalyticsData(products: Product[], orders: PurchaseOrder[], stockByCat: any[]): AnalyticsData {
  const metrics = computeInventoryMetrics(products);
  const profitRows = products.map(productProfitRow);
  const activeOrders = orders.filter((order) => order.status !== "cancelled");
  const openOrderValue = activeOrders
    .filter((order) => !["delivered", "cancelled"].includes(order.status))
    .reduce((sum, order) => sum + order.total, 0);
  const deliveredOrderValue = activeOrders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + order.total, 0);
  const categoryValue = categoryValueFromProducts(products);

  return {
    totalValue: metrics.totalValue,
    totalCost: metrics.totalCost,
    potentialProfit: metrics.potentialProfit,
    profitMargin: metrics.profitMargin,
    markup: metrics.markup,
    avgUnitProfit: metrics.avgUnitProfit,
    orderValue: activeOrders.reduce((sum, order) => sum + order.total, 0),
    openOrderValue,
    deliveredOrderValue,
    stockHealth: {
      inStock: metrics.inStockCount,
      lowStock: metrics.lowStockCount,
      outOfStock: metrics.outOfStockCount,
      inStockPercent: products.length > 0 ? (metrics.inStockCount / products.length) * 100 : 0,
    },
    monthlySales: monthlyOrderData(orders),
    categoryStock: stockByCat.length > 0
      ? stockByCat.map((c: any, i: number) => ({
          category: c.name,
          value: c.total_stock || 0,
          fill: CHART_COLORS[i % CHART_COLORS.length],
        }))
      : categoryValue.map(({ category, units, fill }) => ({ category, value: units, fill })),
    categoryValue,
    topProductsByValue: [...profitRows].sort((a, b) => b.retailValue - a.retailValue).slice(0, 5),
    topProductsByProfit: [...profitRows].sort((a, b) => b.profit - a.profit).slice(0, 5),
    valueComparison: [
      { name: "Inventory", retail: metrics.totalValue, cost: metrics.totalCost, profit: metrics.potentialProfit },
      { name: "Open POs", retail: openOrderValue, cost: openOrderValue, profit: 0 },
      { name: "Delivered POs", retail: deliveredOrderValue, cost: deliveredOrderValue, profit: 0 },
    ],
  };
}

export async function fetchAnalyticsData(): Promise<AnalyticsData> {
  try {
    const [stockByCat, products, orders] = await Promise.all([
      apiFetch<any[]>("/products/stock_by_category/").catch(() => []),
      fetchProducts(),
      fetchPurchaseOrders(),
    ]);
    return buildAnalyticsData(products, orders, stockByCat);
  } catch {
    return buildAnalyticsData(mockProducts, mockOrders, mockCategoryStock.map((c) => ({ name: c.category, total_stock: c.value })));
  }
}
