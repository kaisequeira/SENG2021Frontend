"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Package, Truck, ClipboardList, BarChart3, LogIn, UserPlus, Sparkles } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

/**
 * Home page component that serves as the landing page for the application.
 * Provides navigation to the main sections of the application.
 */
export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <main className="container py-6 md:py-10">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Despatch Advice Management System
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Streamline your despatch process with our comprehensive despatch advice, receipt advice, and fulfillment
            cancellation management system.
          </p>

          {!isAuthenticated && (
            <div className="flex gap-4 mt-4">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {isAuthenticated ? (
        <Tabs defaultValue="despatch" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="despatch">Despatch</TabsTrigger>
            <TabsTrigger value="receipt">Receipt</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="cancellation" className="hidden md:block">
              Cancellation
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="hidden md:block">
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="despatch" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Create Despatch</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create and send Despatch Advice to the delivery party.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/despatch/create" className="w-full">
                    <Button className="w-full">Create New Despatch</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">View Despatch</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">View existing despatch advice documents.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/despatch/view" className="w-full">
                    <Button variant="outline" className="w-full">
                      View Despatches
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Send Despatch</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Send despatches from the warehouse.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/despatch/send" className="w-full">
                    <Button variant="outline" className="w-full">
                      Send Despatch
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="relative border-2 border-primary/50 shadow-lg">
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                  <span className="sr-only">Special feature</span>
                  <Sparkles className="h-4 w-4" />
                </div>

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium">Retrieve Invoice</CardTitle>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Integration
                    </span>
                  </div>
                  <FileText className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Integration with the SUSHI SENG2021 invoice API.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/despatch/invoice-view" className="w-full">
                    <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
                      Retrieve Invoice
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="receipt" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">View Receipt Advice</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">View receipt advice documents for despatches.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/receipt/view" className="w-full">
                    <Button className="w-full">View Receipts</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Product Management</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Manage products in the inventory.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/inventory/products" className="w-full">
                    <Button className="w-full">Manage Products</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Add Stock</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Add stock to existing products.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/inventory/add-stock" className="w-full">
                    <Button variant="outline" className="w-full">
                      Add Stock
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Create Product</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Add new products to the inventory.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/inventory/create-product" className="w-full">
                    <Button variant="outline" className="w-full">
                      Create Product
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cancellation" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Create Cancellation</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Create despatch cancellations.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/cancellation/create" className="w-full">
                    <Button className="w-full">Create Cancellation</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">View Cancellation</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">View existing cancellation documents.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/cancellation/view" className="w-full">
                    <Button variant="outline" className="w-full">
                      View Cancellations
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dashboard</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">View system dashboard and statistics.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full">View Dashboard</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to the Despatch Advice Management System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Please login or register to access the system features. Our platform provides comprehensive tools for
                managing despatch advice, receipt advice, inventory, and cancellations.
              </p>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full gap-2">
                  <UserPlus className="h-4 w-4" />
                  Register
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}
    </main>
  )
}
