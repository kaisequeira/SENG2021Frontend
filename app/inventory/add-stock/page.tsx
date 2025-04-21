"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { addProductStock, getAllProducts, getProductStatus } from "@/lib/api-service"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * AddStockPage component for adding stock to products.
 * Allows users to select a product and add a quantity of stock.
 */
export default function AddStockPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<{ Product_ID: number; Product_Name: string }[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingProducts, setIsFetchingProducts] = useState(true)
  const [productDetails, setProductDetails] = useState<any>(null)

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetchingProducts(true)
      try {
        const data = await getAllProducts()
        setProducts(data.Products)

        // Check if product ID is in URL params
        const productId = searchParams.get("id")
        if (productId) {
          setSelectedProductId(productId)
          fetchProductDetails(Number.parseInt(productId))
        }
      } catch (error) {
        toast.error("Error fetching products", {
          description: error instanceof Error ? error.message : "Unknown error occurred",
        })
      } finally {
        setIsFetchingProducts(false)
      }
    }

    fetchProducts()
  }, [searchParams, toast])

  // Fetch product details when a product is selected
  const fetchProductDetails = async (productId: number) => {
    if (!productId) return

    try {
      const details = await getProductStatus(productId)
      setProductDetails(details)
    } catch (error) {
      toast.error("Error fetching product details", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    }
  }

  // Handle product selection
  const handleProductChange = (value: string) => {
    setSelectedProductId(value)
    fetchProductDetails(Number.parseInt(value))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProductId) {
      toast.error("Validation Error", {
        description: "Please select a product",
      })
      return
    }

    if (quantity < 1) {
      toast.error("Validation Error", {
        description: "Quantity must be at least 1",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await addProductStock(Number.parseInt(selectedProductId), quantity)

      toast.success("Stock Added", {
        description: result,
      })

      // Refresh product details
      fetchProductDetails(Number.parseInt(selectedProductId))

      // Reset quantity
      setQuantity(1)
    } catch (error) {
      toast.error("Error adding stock", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Add Product Stock</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add Stock</CardTitle>
          <CardDescription>Select a product and enter the quantity to add to inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select value={selectedProductId} onValueChange={handleProductChange} disabled={isFetchingProducts}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.Product_ID} value={product.Product_ID.toString()}>
                      {product.Product_Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {productDetails && (
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Current Stock</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-xl font-bold">{productDetails.SOH.Available}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold">{productDetails.SOH.Pending}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Awaiting</p>
                    <p className="text-xl font-bold">{productDetails.SOH.Awaiting}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity to Add</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading || !selectedProductId}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Stock
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

