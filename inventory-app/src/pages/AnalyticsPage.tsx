import { useAnalyticsData } from "./../hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "./../components/ui/card";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalyticsData();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { totalValue, totalCost, orderValue, monthlySales, categoryStock, topProducts } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Analytics</h1>
        <p className="page-subtitle">Inventory insights and reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Inventory Value</p>
          <p className="text-2xl font-bold mt-1">${totalValue.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Cost Value</p>
          <p className="text-2xl font-bold mt-1">${totalCost.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Potential Profit</p>
          <p className="text-2xl font-bold mt-1 text-success">${(totalValue - totalCost).toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Purchase Order Value</p>
          <p className="text-2xl font-bold mt-1">${orderValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Purchase Value Trend</CardTitle></CardHeader>
          <CardContent>
            {monthlySales.some((item) => item.revenue > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No purchase value trend yet.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Orders Trend</CardTitle></CardHeader>
          <CardContent>
            {monthlySales.some((item) => item.orders > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                  <Bar dataKey="orders" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No order trend yet.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Stock Distribution</CardTitle></CardHeader>
          <CardContent>
            {categoryStock.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={categoryStock} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                      {categoryStock.map((entry, i) => (<Cell key={i} fill={entry.fill} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categoryStock.map((category) => (
                    <div key={category.category} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: category.fill }} />
                        <span className="truncate">{category.category}</span>
                      </span>
                      <span className="font-medium">{category.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">No stock distribution yet.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Top Products by Value</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.stock} units × ${p.price}</p>
                  </div>
                </div>
                <p className="font-semibold text-sm">${(p.stock * p.price).toLocaleString()}</p>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No products to rank yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
