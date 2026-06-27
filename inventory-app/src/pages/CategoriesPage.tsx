import { useState } from "react";
import { type Category } from "./../lib/mock-data";
import { useCategories } from "./../hooks/use-api";
import { createCategory, updateCategory, deleteCategory } from "../lib/api";
import { Card, CardContent } from "./../components/ui/card";
import { Button } from "./../components/ui/button";
import { Input } from "./../components/ui/input";
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
import { Plus, Edit, Trash2, FolderOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const { data: apiCategories = [], isLoading, refetch } = useCategories();
  const [localCategories, setLocalCategories] = useState<Category[] | null>(null);
  const categories = localCategories ?? apiCategories;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);

  if (localCategories === null && apiCategories.length > 0) {
    setLocalCategories(apiCategories);
  }

  const handleDelete = async (id: string) => {
    setLocalCategories(categories.filter((c) => c.id !== id));
    await deleteCategory(id);
    toast.success("Category deleted");
    refetch();
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Category = {
      id: editCat?.id || Date.now().toString(),
      name: fd.get("name") as string,
      description: fd.get("description") as string,
      productCount: editCat?.productCount || 0,
    };
    if (editCat) {
      setLocalCategories(categories.map((c) => (c.id === editCat.id ? data : c)));
      await updateCategory(editCat.id, data);
      toast.success("Category updated");
    } else {
      const created = await createCategory(data);
      setLocalCategories([...categories, { ...data, id: created.id }]);
      toast.success("Category added");
    }
    setEditCat(null);
    setDialogOpen(false);
    refetch();
  };

  if (isLoading && !localCategories) {
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
          <h1 className="page-header">Categories</h1>
          <p className="page-subtitle">{categories.length} product categories</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditCat(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Category</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editCat ? "Edit Category" : "Add Category"}</DialogTitle>
              <DialogDescription>
                Group products clearly for filtering and reporting.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2"><Label htmlFor="category-name">Name</Label><Input id="category-name" name="name" defaultValue={editCat?.name} required /></div>
                <div className="space-y-2"><Label htmlFor="category-description">Description</Label><Input id="category-description" name="description" defaultValue={editCat?.description} required /></div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editCat ? "Update" : "Add"} Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditCat(cat); setDialogOpen(true); }}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(cat.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-sm"><span className="font-semibold">{cat.productCount}</span> <span className="text-muted-foreground">products</span></p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
