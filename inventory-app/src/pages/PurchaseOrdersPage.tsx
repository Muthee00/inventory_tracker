import { useState } from "react";
import { type PurchaseOrder } from "./../lib/mock-data";
import { usePurchaseOrders, useSuppliers, useProducts } from "./../hooks/use-api";
import { createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from "../lib/api";
import { Card, CardContent } from "./../components/ui/card";
import { Button } from "./../components/ui/button";
import { Input } from "./../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./../components/ui/dialog";
import { Label } from "./../components/ui/label";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { cn } from "./../lib/utils";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary/10 text-primary",
  shipped: "bg-primary/10 text-primary",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const statusOptions: PurchaseOrder["status"][] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

interface LineItemDraft {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export default function PurchaseOrdersPage() {
  const { data: apiOrders = [], isLoading, refetch } = usePurchaseOrders();
  const { data: suppliers = [] } = useSuppliers();
  const { data: products = [] } = useProducts();
  const [localOrders, setLocalOrders] = useState<PurchaseOrder[] | null>(null);
  const purchaseOrders = localOrders ?? apiOrders;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([{ productId: "", quantity: 1, unitPrice: 0 }]);

  if (localOrders === null && apiOrders.length > 0) {
    setLocalOrders(apiOrders);
  }

  const openOrders = purchaseOrders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length;
  const deliveredValue = purchaseOrders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + order.total, 0);
  const activeValue = purchaseOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  const supplierProducts = products.filter((product) => {
    if (!supplierId) return false;
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier ? product.supplier === supplier.name || product.supplier === supplierId : false;
  });

  const resetForm = () => {
    setSupplierId("");
    setExpectedDate("");
    setLineItems([{ productId: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validItems = lineItems.filter((item) => item.productId && item.quantity > 0);
    if (!supplierId) {
      toast.error("Select a supplier");
      return;
    }
    if (validItems.length === 0) {
      toast.error("Add at least one product");
      return;
    }

    const created = await createPurchaseOrder({
      supplierId,
      expectedDate: expectedDate || undefined,
      orderItems: validItems,
    });
    setLocalOrders([created, ...purchaseOrders]);
    toast.success(`Order ${created.id} created`);
    setDialogOpen(false);
    resetForm();
    refetch();
  };

  const handleStatusChange = async (order: PurchaseOrder, status: PurchaseOrder["status"]) => {
    if (!order.dbId) return;
    setLocalOrders(purchaseOrders.map((o) => (o.dbId === order.dbId ? { ...o, status } : o)));
    await updatePurchaseOrder(order.dbId, { status });
    toast.success(`Order ${order.id} marked as ${status}`);
    if (status === "delivered") {
      toast.info("Stock levels updated for delivered items");
    }
    refetch();
  };

  const handleDelete = async (order: PurchaseOrder) => {
    if (!order.dbId) return;
    setLocalOrders(purchaseOrders.filter((o) => o.dbId !== order.dbId));
    await deletePurchaseOrder(order.dbId);
    toast.success(`Order ${order.id} deleted`);
    refetch();
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { productId: "", quantity: 1, unitPrice: 0 }]);
  };

  const updateLineItem = (index: number, field: keyof LineItemDraft, value: string | number) => {
    setLineItems(lineItems.map((item, i) => {
      if (i !== index) return item;
      if (field === "productId") {
        const product = products.find((p) => p.id === value);
        return { ...item, productId: String(value), unitPrice: product?.costPrice ?? item.unitPrice };
      }
      return { ...item, [field]: value };
    }));
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const draftTotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  if (isLoading && !localOrders) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Purchase Orders</h1>
          <p className="page-subtitle">{purchaseOrders.length} total orders</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Create Order</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
              <DialogDescription>
                Select a supplier and add the products you want to order.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="po-supplier">Supplier</Label>
                  <select
                    id="po-supplier"
                    value={supplierId}
                    onChange={(e) => {
                      setSupplierId(e.target.value);
                      setLineItems([{ productId: "", quantity: 1, unitPrice: 0 }]);
                    }}
                    required
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="" disabled>Select supplier</option>
                    {suppliers.filter((s) => s.status === "active").map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="po-expected-date">Expected Delivery</Label>
                  <Input
                    id="po-expected-date"
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Line Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addLineItem} disabled={!supplierId}>
                    Add Item
                  </Button>
                </div>
                {lineItems.map((item, index) => (
                  <div key={index} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] items-end">
                    <div className="space-y-2">
                      {index === 0 && <Label>Product</Label>}
                      <select
                        value={item.productId}
                        onChange={(e) => updateLineItem(index, "productId", e.target.value)}
                        required
                        disabled={!supplierId}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="" disabled>Select product</option>
                        {supplierProducts.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      {index === 0 && <Label>Qty</Label>}
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, "quantity", Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      {index === 0 && <Label>Unit Price</Label>}
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(index, "unitPrice", Number(e.target.value))}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(index)}
                      disabled={lineItems.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground text-right">
                  Order total: <span className="font-medium text-foreground">${draftTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </p>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create Order</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No purchase orders yet. Create your first order to restock inventory.
                    </TableCell>
                  </TableRow>
                ) : (
                  purchaseOrders.map((order) => (
                    <TableRow key={order.dbId || order.id}>
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
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 items-center">
                          {order.status !== "delivered" && order.status !== "cancelled" && order.dbId && (
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order, e.target.value as PurchaseOrder["status"])}
                              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          )}
                          {order.status === "pending" && order.dbId && (
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(order)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
