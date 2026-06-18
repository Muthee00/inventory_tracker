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

const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("inventrack:access");
  const authHeader: Record<string, string> =
    token && token !== "mock-access-token" ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...authHeader, ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

// ---------- Products ----------
export async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await apiFetch<{ results: any[] }>("/products/");
    return data.results.map((p) => ({
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
    const data = await apiFetch<{ results: any[] }>("/suppliers/");
    return data.results.map((s) => ({
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
    const data = await apiFetch<{ results: any[] }>("/categories/");
    return data.results.map((c) => ({
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
    const data = await apiFetch<{ results: any[] }>("/purchase-orders/");
    return data.results.map((o) => ({
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
    const data = await apiFetch<{ results: any[] }>("/stock-alerts/");
    // fetch products once to enrich alerts with current stock/min stock and sku
    const products = await fetchProducts();
    return data.results.map((a) => {
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
  stockAlerts: number;
  activeSuppliers: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const data = await apiFetch<any>("/products/dashboard_stats/");
    return {
      totalProducts: data.total_products,
      totalValue: data.total_inventory_value,
      stockAlerts: data.low_stock_count + data.out_of_stock_count,
      activeSuppliers: data.total_suppliers,
    };
  } catch {
    return {
      totalProducts: mockProducts.length,
      totalValue: mockProducts.reduce((s, p) => s + p.price * p.stock, 0),
      stockAlerts: mockAlerts.length,
      activeSuppliers: mockSuppliers.filter((s) => s.status === "active").length,
    };
  }
}

// ---------- Analytics ----------
export interface AnalyticsData {
  totalValue: number;
  totalCost: number;
  monthlySales: typeof mockSalesData;
  categoryStock: typeof mockCategoryStock;
  topProducts: Product[];
}

export async function fetchAnalyticsData(): Promise<AnalyticsData> {
  try {
    const [stats, stockByCat, products] = await Promise.all([
      apiFetch<any>("/products/dashboard_stats/"),
      apiFetch<any[]>("/products/stock_by_category/"),
      fetchProducts(),
    ]);
    const colors = ["hsl(220,70%,45%)", "hsl(36,95%,52%)", "hsl(142,70%,40%)", "hsl(280,60%,50%)", "hsl(0,72%,51%)"];
    return {
      totalValue: stats.total_inventory_value,
      totalCost: stats.total_cost_value,
      monthlySales: mockSalesData, // monthly sales need a separate endpoint
      categoryStock: stockByCat.map((c: any, i: number) => ({
        category: c.name,
        value: c.total_stock || 0,
        fill: colors[i % colors.length],
      })),
      topProducts: [...products].sort((a, b) => b.stock * b.price - a.stock * a.price).slice(0, 5),
    };
  } catch {
    return {
      totalValue: mockProducts.reduce((s, p) => s + p.price * p.stock, 0),
      totalCost: mockProducts.reduce((s, p) => s + p.costPrice * p.stock, 0),
      monthlySales: mockSalesData,
      categoryStock: mockCategoryStock,
      topProducts: [...mockProducts].sort((a, b) => b.stock * b.price - a.stock * a.price).slice(0, 5),
    };
  }
}
