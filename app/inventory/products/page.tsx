"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { deleteProduct, getAllProducts, getProductStatus } from "@/lib/api-service"
import { AlertCircle, Loader2, Package, Plus, RefreshCw, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

/**
 * Interface for product in list
 */
interface Product {
  Product_ID: number
  Product_Name: string
}

/**
 * Interface for product details
 */
interface ProductDetails {
  Product_Name: string
  Product_Details: {
    P_Description: string
    P_Release_Date: string
    P_Height: number
    P_Width: number
    P_Depth: number
    P_Weight: number
  }
  SOH: {
    Available: number
    Pending: number
    Awaiting: number
  }
  Last_Stock_Update: string
}

/**
 * ProductsPage component for managing products in the inventory.
 * Displays a list of products and allows viewing details, adding stock, and deleting products.
 */
export default function ProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Fetch all products
  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getAllProducts()
      setProducts(data.Products)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch products")
      toast({
        variant: "destructive",
        title: "Error fetching products",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // View product details
  const viewProductDetails = async (productId: number) => {
    try {
      const details = await getProductStatus(productId)
      setSelectedProduct(details)
      setIsDetailsOpen(true)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching product details",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    }
  }

  // Delete product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    setIsDeleting(true)

    try {
      await deleteProduct(productToDelete.Product_ID)

      toast({
        title: "Product Deleted",
        description: `Successfully deleted product: ${productToDelete.Product_Name}`,
      })

      // Refresh product list
      fetchProducts()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting product",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const confirmDelete = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchProducts} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Link href="/inventory/create-product">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your inventory products</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground mt-2">Add some products to get started</p>
              <Link href="/inventory/create-product">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.Product_ID}>
                    <TableCell>{product.Product_ID}</TableCell>
                    <TableCell>{product.Product_Name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewProductDetails(product.Product_ID)}>
                          View Details
                        </Button>
                        <Link href={`/inventory/add-stock?id=${product.Product_ID}`}>
                          <Button variant="outline" size="sm">
                            Add Stock
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => confirmDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Product Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>Detailed information about the selected product</DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Product Name</h3>
                  <p>{selectedProduct.Product_Name}</p>
                </div>
                <div>
                  <h3 className="font-medium">Last Updated</h3>
                  <p>{new Date(selectedProduct.Last_Stock_Update).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Description</h3>
                <p>{selectedProduct.Product_Details.P_Description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Release Date</h3>
                  <p>{new Date(selectedProduct.Product_Details.P_Release_Date).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Weight</h3>
                  <p>{selectedProduct.Product_Details.P_Weight} kg</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium">Height</h3>
                  <p>{selectedProduct.Product_Details.P_Height} cm</p>
                </div>
                <div>
                  <h3 className="font-medium">Width</h3>
                  <p>{selectedProduct.Product_Details.P_Width} cm</p>
                </div>
                <div>
                  <h3 className="font-medium">Depth</h3>
                  <p>{selectedProduct.Product_Details.P_Depth} cm</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Stock on Hand</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-xl font-bold">{selectedProduct.SOH.Available}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold">{selectedProduct.SOH.Pending}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Awaiting</p>
                    <p className="text-xl font-bold">{selectedProduct.SOH.Awaiting}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            {selectedProduct && (
              <Link href={`/inventory/add-stock?id=${selectedProduct.Product_Name}`}>
                <Button>Add Stock</Button>
              </Link>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product{" "}
              <span className="font-medium">{productToDelete?.Product_Name}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

