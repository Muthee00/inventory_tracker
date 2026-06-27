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
export async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  try {
    const data = await apiFetch<any[] | { results: any[] }>("/purchase-orders/");
    return listFromResponse(data).map((o) => ({
      id: o.order_number || String(o.id),
      supplier: o.supplier_name || "",
      date: o.order_date,
      items: o.items_count,
      total: Number(o.total_amount),
      status: o.status as PurchaseOrder["status"],
    }));
  } catch {
    return mockOrders;
  }
}

// ---------- Stock Alerts ----------
export async function fetchStockAlerts(): Promise<StockAlert[]> {
  try {
    const data = await apiFetch<any[] | { results: any[] }>("/stock-alerts/");
    // fetch products once to enrich alerts with current stock/min stock and sku
    const products = await fetchProducts();
    return listFromResponse(data).map((a) => {
      const prod = products.find((p) => String(p.id) === String(a.product));
      return {
        id: String(a.id),
        product: a.product_name || prod?.name || "",
        sku: prod?.sku || "",
        currentStock: prod?.stock ?? 0,
        minStock: prod?.minStock ?? 0,
        type: a.alert_type === "out-of-stock" ? "out" as const : a.alert_type === "low-stock" ? "low" as const : "low" as const,
      };
    });
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
  stockAlerts: number;
  activeSuppliers: number;
}

function statsFromProducts(products: Product[], suppliers: Supplier[]): DashboardStats {
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  const totalCost = products.reduce((sum, product) => sum + product.costPrice * product.stock, 0);

  return {
    totalProducts: products.length,
    totalValue,
    totalCost,
    potentialProfit: totalValue - totalCost,
    stockAlerts: products.filter((product) => product.status === "low-stock" || product.status === "out-of-stock").length,
    activeSuppliers: suppliers.filter((supplier) => supplier.status === "active").length,
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const data = await apiFetch<any>("/products/dashboard_stats/");
    return {
      totalProducts: data.total_products,
      totalValue: Number(data.total_inventory_value || 0),
      totalCost: Number(data.total_cost_value || 0),
      potentialProfit: Number(data.potential_profit || 0),
      stockAlerts: data.low_stock_count + data.out_of_stock_count,
      activeSuppliers: data.total_suppliers,
    };
  } catch {
    return statsFromProducts(mockProducts, mockSuppliers);
  }
}

// ---------- Analytics ----------
export interface AnalyticsData {
  totalValue: number;
  totalCost: number;
  orderValue: number;
  monthlySales: typeof mockSalesData;
  categoryStock: typeof mockCategoryStock;
  topProducts: Product[];
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

export async function fetchAnalyticsData(): Promise<AnalyticsData> {
  try {
    const [stockByCat, products, orders] = await Promise.all([
      apiFetch<any[]>("/products/stock_by_category/"),
      fetchProducts(),
      fetchPurchaseOrders(),
    ]);
    const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
    const totalCost = products.reduce((sum, product) => sum + product.costPrice * product.stock, 0);
    const orderValue = orders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.total, 0);

    return {
      totalValue,
      totalCost,
      orderValue,
      monthlySales: monthlyOrderData(orders),
      categoryStock: stockByCat.map((c: any, i: number) => ({
        category: c.name,
        value: c.total_stock || 0,
        fill: CHART_COLORS[i % CHART_COLORS.length],
      })),
      topProducts: [...products].sort((a, b) => b.stock * b.price - a.stock * a.price).slice(0, 5),
    };
  } catch {
    return {
      totalValue: mockProducts.reduce((s, p) => s + p.price * p.stock, 0),
      totalCost: mockProducts.reduce((s, p) => s + p.costPrice * p.stock, 0),
      orderValue: mockOrders.filter((order) => order.status !== "cancelled").reduce((s, order) => s + order.total, 0),
      monthlySales: mockSalesData,
      categoryStock: mockCategoryStock,
      topProducts: [...mockProducts].sort((a, b) => b.stock * b.price - a.stock * a.price).slice(0, 5),
    };
  }
}
