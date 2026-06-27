export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryId?: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  supplier: string;
  supplierId?: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  lastUpdated: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  productsSupplied: number;
  status: "active" | "inactive";
}

export interface PurchaseOrder {
  id: string;
  dbId?: string;
  supplier: string;
  supplierId?: string;
  date: string;
  expectedDate?: string;
  items: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

export interface StockAlert {
  id: string;
  product: string;
  sku: string;
  currentStock: number;
  minStock: number;
  type: "low" | "out";
}

export interface MonthlyOrderTrend {
  month: string;
  revenue: number;
  orders: number;
}

export interface CategoryStockSlice {
  category: string;
  value: number;
  fill: string;
}
