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
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  supplier: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  productsSupplied: number;
  status: 'active' | 'inactive';
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  date: string;
  items: number;
  total: number;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
}

export interface StockAlert {
  id: string;
  product: string;
  sku: string;
  currentStock: number;
  minStock: number;
  type: 'low' | 'out';
}

export const categories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and components', productCount: 45 },
  { id: '2', name: 'Office Supplies', description: 'Stationery and office equipment', productCount: 32 },
  { id: '3', name: 'Furniture', description: 'Office and warehouse furniture', productCount: 18 },
  { id: '4', name: 'Safety Equipment', description: 'PPE and safety gear', productCount: 24 },
  { id: '5', name: 'Packaging', description: 'Boxes, tape, and packing materials', productCount: 15 },
];

export const products: Product[] = [
  { id: '1', name: 'Wireless Mouse', sku: 'ELC-001', category: 'Electronics', price: 29.99, costPrice: 15.00, stock: 150, minStock: 20, supplier: 'TechVault Inc.', status: 'in-stock', lastUpdated: '2026-03-07' },
  { id: '2', name: 'USB-C Hub', sku: 'ELC-002', category: 'Electronics', price: 49.99, costPrice: 25.00, stock: 8, minStock: 15, supplier: 'TechVault Inc.', status: 'low-stock', lastUpdated: '2026-03-06' },
  { id: '3', name: 'Standing Desk', sku: 'FRN-001', category: 'Furniture', price: 599.99, costPrice: 350.00, stock: 12, minStock: 5, supplier: 'OfficePro Ltd.', status: 'in-stock', lastUpdated: '2026-03-05' },
  { id: '4', name: 'A4 Copy Paper (5 reams)', sku: 'OFS-001', category: 'Office Supplies', price: 24.99, costPrice: 12.00, stock: 0, minStock: 50, supplier: 'PaperWorld Co.', status: 'out-of-stock', lastUpdated: '2026-03-07' },
  { id: '5', name: 'Safety Helmet', sku: 'SAF-001', category: 'Safety Equipment', price: 34.99, costPrice: 18.00, stock: 75, minStock: 20, supplier: 'SafeGuard Supplies', status: 'in-stock', lastUpdated: '2026-03-04' },
  { id: '6', name: 'Shipping Box (Large)', sku: 'PKG-001', category: 'Packaging', price: 3.99, costPrice: 1.50, stock: 5, minStock: 100, supplier: 'PackRight Inc.', status: 'low-stock', lastUpdated: '2026-03-07' },
  { id: '7', name: 'Mechanical Keyboard', sku: 'ELC-003', category: 'Electronics', price: 89.99, costPrice: 45.00, stock: 42, minStock: 10, supplier: 'TechVault Inc.', status: 'in-stock', lastUpdated: '2026-03-06' },
  { id: '8', name: 'Ergonomic Chair', sku: 'FRN-002', category: 'Furniture', price: 449.99, costPrice: 250.00, stock: 3, minStock: 5, supplier: 'OfficePro Ltd.', status: 'low-stock', lastUpdated: '2026-03-03' },
  { id: '9', name: 'Hi-Vis Vest', sku: 'SAF-002', category: 'Safety Equipment', price: 12.99, costPrice: 5.00, stock: 200, minStock: 30, supplier: 'SafeGuard Supplies', status: 'in-stock', lastUpdated: '2026-03-07' },
  { id: '10', name: '27" Monitor', sku: 'ELC-004', category: 'Electronics', price: 349.99, costPrice: 200.00, stock: 0, minStock: 8, supplier: 'TechVault Inc.', status: 'out-of-stock', lastUpdated: '2026-03-07' },
];

export const suppliers: Supplier[] = [
  { id: '1', name: 'TechVault Inc.', email: 'orders@techvault.com', phone: '+1 555-0101', address: '123 Tech Park, San Jose, CA', productsSupplied: 45, status: 'active' },
  { id: '2', name: 'OfficePro Ltd.', email: 'sales@officepro.com', phone: '+1 555-0102', address: '456 Commerce Blvd, Chicago, IL', productsSupplied: 32, status: 'active' },
  { id: '3', name: 'PaperWorld Co.', email: 'info@paperworld.com', phone: '+1 555-0103', address: '789 Mill Road, Portland, OR', productsSupplied: 15, status: 'active' },
  { id: '4', name: 'SafeGuard Supplies', email: 'orders@safeguard.com', phone: '+1 555-0104', address: '321 Safety Lane, Dallas, TX', productsSupplied: 24, status: 'active' },
  { id: '5', name: 'PackRight Inc.', email: 'sales@packright.com', phone: '+1 555-0105', address: '654 Box Street, Memphis, TN', productsSupplied: 15, status: 'inactive' },
];

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'PO-001', supplier: 'TechVault Inc.', date: '2026-03-07', items: 3, total: 4500.00, status: 'pending' },
  { id: 'PO-002', supplier: 'PaperWorld Co.', date: '2026-03-06', items: 2, total: 1200.00, status: 'approved' },
  { id: 'PO-003', supplier: 'OfficePro Ltd.', date: '2026-03-05', items: 5, total: 8750.00, status: 'shipped' },
  { id: 'PO-004', supplier: 'SafeGuard Supplies', date: '2026-03-04', items: 4, total: 2100.00, status: 'delivered' },
  { id: 'PO-005', supplier: 'PackRight Inc.', date: '2026-03-03', items: 1, total: 450.00, status: 'cancelled' },
  { id: 'PO-006', supplier: 'TechVault Inc.', date: '2026-03-02', items: 6, total: 12300.00, status: 'delivered' },
];

export const stockAlerts: StockAlert[] = [
  { id: '1', product: 'USB-C Hub', sku: 'ELC-002', currentStock: 8, minStock: 15, type: 'low' },
  { id: '2', product: 'A4 Copy Paper (5 reams)', sku: 'OFS-001', currentStock: 0, minStock: 50, type: 'out' },
  { id: '3', product: 'Shipping Box (Large)', sku: 'PKG-001', currentStock: 5, minStock: 100, type: 'low' },
  { id: '4', product: 'Ergonomic Chair', sku: 'FRN-002', currentStock: 3, minStock: 5, type: 'low' },
  { id: '5', product: '27" Monitor', sku: 'ELC-004', currentStock: 0, minStock: 8, type: 'out' },
];

export const monthlySalesData = [
  { month: 'Oct', revenue: 42000, orders: 120 },
  { month: 'Nov', revenue: 48000, orders: 145 },
  { month: 'Dec', revenue: 55000, orders: 168 },
  { month: 'Jan', revenue: 38000, orders: 110 },
  { month: 'Feb', revenue: 46000, orders: 135 },
  { month: 'Mar', revenue: 52000, orders: 155 },
];

export const categoryStockData = [
  { category: 'Electronics', value: 200, fill: 'hsl(220, 70%, 45%)' },
  { category: 'Office', value: 32, fill: 'hsl(36, 95%, 52%)' },
  { category: 'Furniture', value: 15, fill: 'hsl(142, 70%, 40%)' },
  { category: 'Safety', value: 275, fill: 'hsl(280, 60%, 50%)' },
  { category: 'Packaging', value: 5, fill: 'hsl(0, 72%, 51%)' },
];
