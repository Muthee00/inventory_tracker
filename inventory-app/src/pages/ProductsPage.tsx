import { useState } from "react";
import { type Product } from "./../lib/mock-data";
import { useProducts, useCategories, useSuppliers } from "./../hooks/use-api";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../components/ui/select";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { cn } from "./../lib/utils";
import { toast } from "sonner";
import { createProduct, updateProduct, deleteProduct } from "../lib/api";

export default function ProductsPage() {
  const { data: apiProducts = [], isLoading, refetch } = useProducts();
  const { data: apiCategories = [] } = useCategories();
  const { data: apiSuppliers = [] } = useSuppliers();
  const [localProducts, setLocalProducts] = useState<Product[] | null>(null);
  const products = localProducts ?? apiProducts;

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Sync local state when API data arrives
  if (localProducts === null && apiProducts.length > 0) {
    setLocalProducts(apiProducts);
  }

  const categories = apiCategories.length > 0 ? apiCategories.map((c) => c.name) : [...new Set(products.map((p) => p.category))];
  const suppliers = apiSuppliers.length > 0 ? apiSuppliers.map((s) => s.name) : [...new Set(products.map((p) => p.supplier))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id: string) => {
    setLocalProducts(products.filter((p) => p.id !== id));
    await deleteProduct(id);
    toast.success("Product deleted");
    refetch();
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const stock = Number(fd.get("stock"));
    const minStock = Number(fd.get("minStock"));
    const status: Product["status"] = stock === 0 ? "out-of-stock" : stock <= minStock ? "low-stock" : "in-stock";

    const rawCategory = fd.get("category") as string;
    const categoryName = apiCategories.find((c) => c.id === rawCategory)?.name ?? rawCategory;
    const rawSupplier = fd.get("supplier") as string;
    const supplierName = apiSuppliers.find((s) => s.id === rawSupplier)?.name ?? rawSupplier;

    const data: Product = {
      id: editProduct?.id || Date.now().toString(),
      name: fd.get("name") as string,
      sku: fd.get("sku") as string,
      // send the category id to the API, but keep the human name for UI display
      category: rawCategory,
      price: Number(fd.get("price")),
      costPrice: Number(fd.get("costPrice")),
      stock,
      minStock,
      // send supplier id to API, show supplier name in UI
      supplier: rawSupplier,
      status,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    if (editProduct) {
      // Optimistically update UI using category and supplier names for display
      setLocalProducts(products.map((p) => (p.id === editProduct.id ? { ...data, category: categoryName, supplier: supplierName } : p)));
      await updateProduct(editProduct.id, data);
      toast.success("Product updated");
    } else {
      const created = await createProduct(data);
      setLocalProducts([...products, { ...data, id: created.id, category: categoryName, supplier: supplierName }]);
      toast.success("Product added");
    }
    setEditProduct(null);
    setDialogOpen(false);
    refetch();
  };

  if (isLoading && !localProducts) {
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
          <h1 className="page-header">Products</h1>
          <p className="page-subtitle">{products.length} products in inventory</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditProduct(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editProduct ? "Edit Product" : "Add Product"}</DialogTitle>
              <DialogDescription>
                Keep catalog, pricing, and stock thresholds accurate.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="product-name">Name</Label><Input id="product-name" name="name" defaultValue={editProduct?.name} required /></div>
                <div className="space-y-2"><Label htmlFor="product-sku">SKU</Label><Input id="product-sku" name="sku" defaultValue={editProduct?.sku} required /></div>
                <div>
                  <Label htmlFor="product-category">Category</Label>
                  <select
                    id="product-category"
                    name="category"
                    defaultValue={apiCategories.length > 0 ? (apiCategories.find((c) => c.name === editProduct?.category)?.id ?? "") : (editProduct?.category ?? "")}
                    required
                    className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="" disabled hidden>Select category</option>
                    {apiCategories.length > 0
                      ? apiCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))
                      : categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="product-supplier">Supplier</Label>
                  <select
                    id="product-supplier"
                    name="supplier"
                    defaultValue={apiSuppliers.length > 0 ? (apiSuppliers.find((s) => s.name === editProduct?.supplier)?.id ?? "") : (editProduct?.supplier ?? "")}
                    required
                    className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="" disabled hidden>Select supplier</option>
                    {apiSuppliers.length > 0
                      ? apiSuppliers.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))
                      : suppliers.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div className="space-y-2"><Label htmlFor="product-price">Price</Label><Input id="product-price" name="price" type="number" min="0" step="0.01" defaultValue={editProduct?.price} required /></div>
                <div className="space-y-2"><Label htmlFor="product-cost">Cost Price</Label><Input id="product-cost" name="costPrice" type="number" min="0" step="0.01" defaultValue={editProduct?.costPrice} required /></div>
                <div className="space-y-2"><Label htmlFor="product-stock">Stock</Label><Input id="product-stock" name="stock" type="number" min="0" defaultValue={editProduct?.stock} required /></div>
                <div className="space-y-2"><Label htmlFor="product-min-stock">Min Stock</Label><Input id="product-min-stock" name="minStock" type="number" min="0" defaultValue={editProduct?.minStock} required /></div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editProduct ? "Update" : "Add"} Product</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell className="text-right">${p.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{p.stock}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "status-badge",
                        p.status === "in-stock" && "status-in-stock",
                        p.status === "low-stock" && "status-low-stock",
                        p.status === "out-of-stock" && "status-out-of-stock",
                      )}>
                        {p.status === "in-stock" ? "In Stock" : p.status === "low-stock" ? "Low Stock" : "Out of Stock"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditProduct(p); setDialogOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
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
