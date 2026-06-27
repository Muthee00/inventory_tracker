import { usePurchaseOrders } from "./../hooks/use-api";
import { Card, CardContent } from "./../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../components/ui/table";
import { Loader2 } from "lucide-react";
import { cn } from "./../lib/utils";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-primary/10 text-primary",
  shipped: "bg-primary/10 text-primary",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function PurchaseOrdersPage() {
  const { data: purchaseOrders = [], isLoading } = usePurchaseOrders();
  const openOrders = purchaseOrders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length;
  const deliveredValue = purchaseOrders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + order.total, 0);
  const activeValue = purchaseOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

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
        <h1 className="page-header">Purchase Orders</h1>
        <p className="page-subtitle">{purchaseOrders.length} total orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Open Orders</p>
          <p className="text-2xl font-bold mt-1">{openOrders}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Active Order Value</p>
          <p className="text-2xl font-bold mt-1">${activeValue.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Delivered Value</p>
          <p className="text-2xl font-bold mt-1">${deliveredValue.toLocaleString()}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm font-medium">{order.id}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">{order.items}</TableCell>
                    <TableCell className="text-right font-medium">${order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={cn("status-badge capitalize", statusStyles[order.status])}>
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
