import {
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAnalyticsData, useDashboardStats, useStockAlerts, usePurchaseOrders } from "./../hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "./../components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { cn } from "./../lib/utils";
import { Skeleton } from "./../components/ui/skeleton";

export default function Dashboard() {
  const { data: dashStats, isLoading: statsLoading } = useDashboardStats();
  const { data: analytics } = useAnalyticsData();
  const { data: alerts = [] } = useStockAlerts();
  const { data: orders = [] } = usePurchaseOrders();
  const monthlySalesData = analytics?.monthlySales ?? [];
  const categoryStockData = analytics?.categoryStock ?? [];

  const stats = [
    {
      label: "Total Products",
      value: dashStats?.totalProducts.toString() || "—",
      change: "+12%", trend: "up" as const,
      icon: Package, color: "text-primary", bg: "bg-primary/10",
    },
    {
      label: "Total Value",
      value: dashStats ? `$${dashStats.totalValue.toLocaleString()}` : "—",
      change: "Live", trend: "up" as const,
      icon: DollarSign, color: "text-success", bg: "bg-success/10",
    },
    {
      label: "Stock Alerts",
      value: dashStats?.stockAlerts.toString() || "—",
      change: "+2", trend: "down" as const,
      icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10",
    },
    {
      label: "Active Suppliers",
      value: dashStats?.activeSuppliers.toString() || "—",
      change: "0%", trend: "up" as const,
      icon: TrendingUp, color: "text-primary", bg: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Dashboard</h1>
        <p className="page-subtitle">Overview of your inventory performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            {statsLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", stat.bg)}>
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>{stat.change}</span>
                  <span className="text-muted-foreground">{stat.change === "Live" ? "from inventory" : "vs last month"}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Purchase Order Value</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {monthlySalesData.length === 0 && (
              <p className="mt-3 text-center text-sm text-muted-foreground">No purchase order history yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Stock by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryStockData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {categoryStockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {categoryStockData.length > 0 ? categoryStockData.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: cat.fill }} />
                    <span>{cat.category}</span>
                  </div>
                  <span className="font-medium">{cat.value}</span>
                </div>
              )) : (
                <p className="text-center text-sm text-muted-foreground">No category stock yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Stock Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {alerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{alert.product}</p>
                  <p className="text-xs text-muted-foreground">{alert.sku}</p>
                </div>
                <span className={cn("status-badge", alert.type === "out" ? "status-out-of-stock" : "status-low-stock")}>
                  {alert.type === "out" ? "Out of Stock" : `${alert.currentStock} left`}
                </span>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No active stock alerts.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Purchase Orders</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.supplier}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${order.total.toLocaleString()}</p>
                  <p className={cn(
                    "text-xs capitalize",
                    order.status === "delivered" && "text-success",
                    order.status === "pending" && "text-warning",
                    order.status === "cancelled" && "text-destructive",
                    (order.status === "shipped" || order.status === "approved") && "text-primary",
                  )}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No purchase orders yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
