"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createProduct } from "@/lib/api-service"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

/**
 * CreateProductPage component for adding new products to the inventory.
 * Allows users to enter product details and create a new product.
 */
export default function CreateProductPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  // Form state
  const [formData, setFormData] = useState({
    Product_Name: "",
    Product_Details: {
      P_Description: "",
      P_Release_Date: 0,
      P_Height: 0,
      P_Width: 0,
      P_Depth: 0,
      P_Weight: 0,
    },
  })

  // Handle form input
  const handleInputChange = (field: string, value: string | number) => {
    if (field === "Product_Name") {
      setFormData((prev) => ({
        ...prev,
        Product_Name: value as string,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        Product_Details: {
          ...prev.Product_Details,
          [field]: field === "P_Description" ? value : Number(value),
        },
      }))
    }
  }

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      // Convert date to integer (timestamp)
      const timestamp = Math.floor(selectedDate.getTime() / 1000)
      handleInputChange("P_Release_Date", timestamp)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.Product_Name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Product name is required",
      })
      return
    }

    setIsLoading(true)

    try {
      const productId = await createProduct(formData)

      toast({
        title: "Product Created",
        description: `Successfully created product with ID: ${productId}`,
      })

      // Reset form
      setFormData({
        Product_Name: "",
        Product_Details: {
          P_Description: "",
          P_Release_Date: 0,
          P_Height: 0,
          P_Width: 0,
          P_Depth: 0,
          P_Weight: 0,
        },
      })
      setDate(undefined)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating product",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Enter the details for the new product</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="product-name"
                placeholder="Enter product name"
                value={formData.Product_Name}
                onChange={(e) => handleInputChange("Product_Name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                value={formData.Product_Details.P_Description}
                onChange={(e) => handleInputChange("P_Description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="release-date">Release Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="release-date"
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Height in cm"
                  value={formData.Product_Details.P_Height || ""}
                  onChange={(e) => handleInputChange("P_Height", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Width in cm"
                  value={formData.Product_Details.P_Width || ""}
                  onChange={(e) => handleInputChange("P_Width", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="depth">Depth (cm)</Label>
                <Input
                  id="depth"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Depth in cm"
                  value={formData.Product_Details.P_Depth || ""}
                  onChange={(e) => handleInputChange("P_Depth", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Weight in kg"
                  value={formData.Product_Details.P_Weight || ""}
                  onChange={(e) => handleInputChange("P_Weight", e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Product
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

