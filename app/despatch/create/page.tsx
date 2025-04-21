"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { createOrderDespatch, getAllProducts } from "@/lib/api-service"
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 * CreateDespatchPage component for creating new despatch advice.
 * Allows users to enter customer information, order details, and select products.
 */
export default function CreateDespatchPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<{ Product_ID: number; Product_Name: string }[]>([])
  const [date, setDate] = useState<Date>(new Date())

  // Form state
  const [formData, setFormData] = useState({
    Contact_Information: {
      Email: "",
      Phone: "",
      Address: {
        Street: "",
        Building_Name: "",
        Building_Number: "",
        City: "",
        Postal_Code: "",
        Country: "",
      },
    },
    Order_Details: {
      Order_ID: 0,
      Sales_Order_ID: "",
      Issue_Date: format(new Date(), "yyyy-MM-dd"),
    },
    Products: [{ Product_ID: 0, Quantity: 1 }],
  })

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts()
        setProducts(data.Products)
      } catch (error) {
        toast.error("Failed to fetch products", {
          description: error instanceof Error ? error.message : "Unknown error occurred",
        })
      }
    }

    fetchProducts()
  }, [toast])

  // Handle form input
  const handleInputChange = (section: string, field: string, value: string | number) => {
    if (section === "Contact_Information.Address") {
      setFormData((prev) => ({
        ...prev,
        Contact_Information: {
          ...prev.Contact_Information,
          Address: {
            ...prev.Contact_Information.Address,
            [field]: value,
          },
        },
      }))
    } else if (section === "Contact_Information") {
      setFormData((prev) => ({
        ...prev,
        Contact_Information: {
          ...prev.Contact_Information,
          [field]: value,
        },
      }))
    } else if (section === "Order_Details") {
      setFormData((prev) => ({
        ...prev,
        Order_Details: {
          ...prev.Order_Details,
          [field]: value,
        },
      }))
    } else {
      console.error(`Unknown section: ${section}`)
    }
  }

  // Handle product selection
  const handleProductChange = (index: number, field: string, value: number) => {
    if (!["Product_ID", "Quantity"].includes(field)) {
      console.error(`Invalid field: ${field}`)
      return
    }
  
    setFormData((prev) => {
      const updatedProducts = [...prev.Products]
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      }
      return {
        ...prev,
        Products: updatedProducts,
      }
    })
  }

  // Add product to order
  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      Products: [...prev.Products, { Product_ID: 0, Quantity: 1 }],
    }))
  }

  // Remove product from order
  const removeProduct = (index: number) => {
    if (formData.Products.length === 1) {
      return // Keep at least one product
    }

    setFormData((prev) => {
      const updatedProducts = [...prev.Products]
      updatedProducts.splice(index, 1)
      return {
        ...prev,
        Products: updatedProducts,
      }
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.Contact_Information.Email || !formData.Contact_Information.Phone) {
      toast.error("Please fill in all required contact information fields", {
        description: "Please fill in all required contact information fields",
      })
      return
    }

    if (
      !formData.Contact_Information.Address.Street ||
      !formData.Contact_Information.Address.City ||
      !formData.Contact_Information.Address.Postal_Code ||
      !formData.Contact_Information.Address.Country
    ) {
      toast.error("Validation Error", {
        description: "Please fill in all required address fields",
      })
      return
    }

    if (!formData.Order_Details.Order_ID || !formData.Order_Details.Sales_Order_ID) {
      toast.error("Validation Error", {
        description: "Please fill in all required order details",
      })
      return
    }

    // Validate products
    const invalidProducts = formData.Products.some((p) => p.Product_ID === 0 || p.Quantity < 1)
    if (invalidProducts) {
      toast.error("Validation Error", {
        description: "Please select valid products and quantities",
      })
      return
    }

    setIsLoading(true)

    try {
      const despatchIds = await createOrderDespatch(formData)
      toast.success("Despatch created successfully", {
        description: `Despatch ID(s): ${despatchIds.join(", ")}`
      })

      // Reset form
      setFormData({
        Contact_Information: {
          Email: "",
          Phone: "",
          Address: {
            Street: "",
            Building_Name: "",
            Building_Number: "",
            City: "",
            Postal_Code: "",
            Country: "",
          },
        },
        Order_Details: {
          Order_ID: 0,
          Sales_Order_ID: "",
          Issue_Date: format(new Date(), "yyyy-MM-dd"),
        },
        Products: [{ Product_ID: 0, Quantity: 1 }],
      })
    } catch (error) {
      toast.error("Failed to create despatch", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create Despatch Advice</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Enter the customer's contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@example.com"
                    value={formData.Contact_Information.Email}
                    onChange={(e) => handleInputChange("Contact_Information", "Email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="1234567890"
                    value={formData.Contact_Information.Phone}
                    onChange={(e) => handleInputChange("Contact_Information", "Phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="street">
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="street"
                  placeholder="123 Main St"
                  value={formData.Contact_Information.Address.Street}
                  onChange={(e) => handleInputChange("Contact_Information.Address", "Street", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="building_name">Building Name</Label>
                  <Input
                    id="building_name"
                    placeholder="Skyline Tower"
                    value={formData.Contact_Information.Address.Building_Name}
                    onChange={(e) => handleInputChange("Contact_Information.Address", "Building_Name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="building_number">Building Number</Label>
                  <Input
                    id="building_number"
                    placeholder="5A"
                    value={formData.Contact_Information.Address.Building_Number}
                    onChange={(e) =>
                      handleInputChange("Contact_Information.Address", "Building_Number", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={formData.Contact_Information.Address.City}
                    onChange={(e) => handleInputChange("Contact_Information.Address", "City", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">
                    Postal Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="postal_code"
                    placeholder="10001"
                    value={formData.Contact_Information.Address.Postal_Code}
                    onChange={(e) => handleInputChange("Contact_Information.Address", "Postal_Code", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="country"
                    placeholder="USA"
                    value={formData.Contact_Information.Address.Country}
                    onChange={(e) => handleInputChange("Contact_Information.Address", "Country", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Enter the order information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order_id">
                    Order ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="order_id"
                    type="number"
                    placeholder="123456"
                    value={formData.Order_Details.Order_ID || ""}
                    onChange={(e) =>
                      handleInputChange("Order_Details", "Order_ID", Number.parseInt(e.target.value) || 0)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sales_order_id">
                    Sales Order ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="sales_order_id"
                    placeholder="SO-987654"
                    value={formData.Order_Details.Sales_Order_ID}
                    onChange={(e) => handleInputChange("Order_Details", "Sales_Order_ID", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue_date">
                    Issue Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          if (newDate) {
                            setDate(newDate)
                            handleInputChange("Order_Details", "Issue_Date", format(newDate, "yyyy-MM-dd"))
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Select products and quantities for this despatch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.Products.map((product, index) => (
                <div key={index} className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`product-${index}`}>
                      Product <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={product.Product_ID.toString()}
                      onValueChange={(value) => handleProductChange(index, "Product_ID", Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.Product_ID} value={p.Product_ID.toString()}>
                            {p.Product_Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24 space-y-2">
                    <Label htmlFor={`quantity-${index}`}>
                      Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={product.Quantity}
                      onChange={(e) =>
                        handleProductChange(index, "Quantity", Number.parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProduct(index)}
                    disabled={formData.Products.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addProduct} className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Despatch
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}

