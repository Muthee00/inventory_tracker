import { useStockAlerts } from "./../hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "./../components/ui/card";
import { AlertTriangle, PackageX, Loader2 } from "lucide-react";
import { cn } from "./../lib/utils";

export default function StockAlertsPage() {
  const { data: stockAlerts = [], isLoading } = useStockAlerts();

  const outOfStock = stockAlerts.filter((a) => a.type === "out");
  const lowStock = stockAlerts.filter((a) => a.type === "low");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Stock Alerts</h1>
        <p className="page-subtitle">{stockAlerts.length} items need attention</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <PackageX className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold">{outOfStock.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold">{lowStock.length}</p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stockAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                {alert.type === "out" ? (
                  <PackageX className="h-5 w-5 text-destructive" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-warning" />
                )}
                <div>
                  <p className="text-sm font-medium">{alert.product}</p>
                  <p className="text-xs text-muted-foreground font-mono">{alert.sku}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{alert.currentStock} / {alert.minStock}</p>
                <span className={cn(
                  "status-badge text-[10px]",
                  alert.type === "out" ? "status-out-of-stock" : "status-low-stock"
                )}>
                  {alert.type === "out" ? "Out of Stock" : "Low Stock"}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
