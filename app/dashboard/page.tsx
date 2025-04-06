"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { getAllProducts, getProductStatus } from "@/lib/api-service"
import { BarChart, LineChart, PieChart, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

/**
 * Interface for stock statistics
 */
interface StockStatistics {
  available: number
  pending: number
  awaiting: number
  isLoading: boolean
}

/**
 * DashboardPage component that displays system statistics and metrics.
 * Shows product counts, recent despatches, and other relevant information.
 */
export default function DashboardPage() {
  const { toast } = useToast()
  const [productCount, setProductCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [stockStats, setStockStats] = useState<StockStatistics>({
    available: 0,
    pending: 0,
    awaiting: 0,
    isLoading: true,
  })

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch all products
        const productsData = await getAllProducts()
        setProductCount(productsData.Products.length)

        // Fetch stock statistics for each product
        await fetchStockStatistics(productsData.Products)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching dashboard data",
          description: error instanceof Error ? error.message : "Unknown error occurred",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  /**
   * Fetches stock statistics for all products and calculates totals
   */
  const fetchStockStatistics = async (products: { Product_ID: number; Product_Name: string }[]) => {
    setStockStats((prev) => ({ ...prev, isLoading: true }))

    try {
      let totalAvailable = 0
      let totalPending = 0
      let totalAwaiting = 0

      // Fetch status for each product and sum up the quantities
      const productStatuses = await Promise.all(products.map((product) => getProductStatus(product.Product_ID)))

      productStatuses.forEach((status) => {
        totalAvailable += status.SOH.Available
        totalPending += status.SOH.Pending
        totalAwaiting += status.SOH.Awaiting
      })

      setStockStats({
        available: totalAvailable,
        pending: totalPending,
        awaiting: totalAwaiting,
        isLoading: false,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching stock statistics",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
      setStockStats((prev) => ({ ...prev, isLoading: false }))
    }
  }

  // Mock data for recent despatches - we could fetch this from an API in the future
  const recentDespatches = [
    { id: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc012", date: "2025-03-15", status: "Delivered" },
    { id: "21cf6c48-f1c9-53f1-9edf-ed9d5bffd123", date: "2025-03-14", status: "Pending" },
    { id: "32dg7d59-g2d0-64g2-0feg-fe0e6cgge234", date: "2025-03-13", status: "Cancelled" },
    { id: "43eh8e60-h3e1-75h3-1gfh-gf1f7dhhe345", date: "2025-03-12", status: "Delivered" },
  ]

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : productCount}</div>
            <p className="text-xs text-muted-foreground">Products in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Stock</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stockStats.isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                stockStats.available
              )}
            </div>
            <p className="text-xs text-muted-foreground">Units available for despatch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Despatches</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stockStats.isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                stockStats.pending
              )}
            </div>
            <p className="text-xs text-muted-foreground">Units pending despatch</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Despatches</CardTitle>
            <CardDescription>Latest despatch activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDespatches.map((despatch) => (
                <div key={despatch.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{despatch.id}</p>
                    <p className="text-xs text-muted-foreground">{despatch.date}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      despatch.status === "Delivered"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : despatch.status === "Cancelled"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {despatch.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Stock Overview</CardTitle>
            <CardDescription>Current inventory status</CardDescription>
          </CardHeader>
          <CardContent>
            {stockStats.isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Available</p>
                    <p className="text-sm font-medium">{stockStats.available}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{
                        width: `${(stockStats.available / (stockStats.available + stockStats.pending + stockStats.awaiting || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Pending</p>
                    <p className="text-sm font-medium">{stockStats.pending}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-500 rounded-full h-2"
                      style={{
                        width: `${(stockStats.pending / (stockStats.available + stockStats.pending + stockStats.awaiting || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Awaiting</p>
                    <p className="text-sm font-medium">{stockStats.awaiting}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2"
                      style={{
                        width: `${(stockStats.awaiting / (stockStats.available + stockStats.pending + stockStats.awaiting || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

