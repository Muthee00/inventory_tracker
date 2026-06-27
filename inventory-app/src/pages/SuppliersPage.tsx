import { useState } from "react";
import { type Supplier } from "./../lib/mock-data";
import { useSuppliers } from "./../hooks/use-api";
import { createSupplier, updateSupplier, deleteSupplier } from "../lib/api";
import { Card, CardContent, CardHeader } from "./../components/ui/card";
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
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { cn } from "./../lib/utils";
import { toast } from "sonner";

export default function SuppliersPage() {
  const { data: apiSuppliers = [], isLoading, refetch } = useSuppliers();
  const [localSuppliers, setLocalSuppliers] = useState<Supplier[] | null>(null);
  const suppliers = localSuppliers ?? apiSuppliers;

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  if (localSuppliers === null && apiSuppliers.length > 0) {
    setLocalSuppliers(apiSuppliers);
  }

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setLocalSuppliers(suppliers.filter((s) => s.id !== id));
    await deleteSupplier(id);
    toast.success("Supplier deleted");
    refetch();
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Supplier = {
      id: editSupplier?.id || Date.now().toString(),
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      address: fd.get("address") as string,
      productsSupplied: editSupplier?.productsSupplied || 0,
      status: (fd.get("status") as string) === "active" ? "active" : "inactive",
    };
    if (editSupplier) {
      setLocalSuppliers(suppliers.map((s) => (s.id === editSupplier.id ? data : s)));
      await updateSupplier(editSupplier.id, data);
      toast.success("Supplier updated");
    } else {
      const created = await createSupplier(data);
      setLocalSuppliers([...suppliers, { ...data, id: created.id }]);
      toast.success("Supplier added");
    }
    setEditSupplier(null);
    setDialogOpen(false);
    refetch();
  };

  if (isLoading && !localSuppliers) {
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
          <h1 className="page-header">Suppliers</h1>
          <p className="page-subtitle">{suppliers.length} registered suppliers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditSupplier(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Supplier</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editSupplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
              <DialogDescription>
                Maintain supplier contact details and account status.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="supplier-name">Name</Label><Input id="supplier-name" name="name" defaultValue={editSupplier?.name} required /></div>
                <div className="space-y-2"><Label htmlFor="supplier-email">Email</Label><Input id="supplier-email" name="email" type="email" defaultValue={editSupplier?.email} required /></div>
                <div className="space-y-2"><Label htmlFor="supplier-phone">Phone</Label><Input id="supplier-phone" name="phone" defaultValue={editSupplier?.phone} required /></div>
                <div className="space-y-2">
                  <Label htmlFor="supplier-status">Status</Label>
                  <select id="supplier-status" name="status" defaultValue={editSupplier?.status || "active"} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                </div>
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="supplier-address">Address</Label><Input id="supplier-address" name="address" defaultValue={editSupplier?.address} required /></div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editSupplier ? "Update" : "Add"} Supplier</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search suppliers..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell className="text-right">{s.productsSupplied}</TableCell>
                    <TableCell>
                      <span className={cn("status-badge", s.status === "active" ? "status-in-stock" : "status-out-of-stock")}>
                        {s.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditSupplier(s); setDialogOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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
