"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Package, Menu, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

/**
 * Header component that appears on all pages.
 * Contains the navigation menu and theme toggle.
 */
export default function Header() {
  const { isAuthenticated, logout } = useAuth()
  const pathname = usePathname()

  const isActiveRoute = (prefix: string) => {
    return pathname?.startsWith(prefix)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 transition-colors hover:opacity-80">
            <Package className="h-6 w-6" />
            <span className="inline-block font-bold">Despatch Advice System</span>
          </Link>
          {isAuthenticated && (
            <nav className="hidden md:flex gap-6">
              <Link
                href="/despatch/create"
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  isActiveRoute("/despatch") ? "text-primary" : "text-muted-foreground",
                )}
              >
                Despatch
              </Link>
              <Link
                href="/receipt/view"
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  isActiveRoute("/receipt") ? "text-primary" : "text-muted-foreground",
                )}
              >
                Receipt
              </Link>
              <Link
                href="/inventory/products"
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  isActiveRoute("/inventory") ? "text-primary" : "text-muted-foreground",
                )}
              >
                Inventory
              </Link>
              <Link
                href="/cancellation/create"
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  isActiveRoute("/cancellation") ? "text-primary" : "text-muted-foreground",
                )}
              >
                Cancellation
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
                )}
              >
                Dashboard
              </Link>
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-muted">
                      <User className="h-[1.2rem] w-[1.2rem]" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="cursor-pointer hover:bg-muted">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="hover:bg-muted">
                  Login
                </Button>
              </Link>
            )}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="hover:bg-muted">
                    <Menu className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/despatch/create"
                          className={cn("w-full cursor-pointer", isActiveRoute("/despatch") && "text-primary")}
                        >
                          Despatch
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/receipt/view"
                          className={cn("w-full cursor-pointer", isActiveRoute("/receipt") && "text-primary")}
                        >
                          Receipt
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/inventory/products"
                          className={cn("w-full cursor-pointer", isActiveRoute("/inventory") && "text-primary")}
                        >
                          Inventory
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/cancellation/create"
                          className={cn("w-full cursor-pointer", isActiveRoute("/cancellation") && "text-primary")}
                        >
                          Cancellation
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard"
                          className={cn("w-full cursor-pointer", pathname === "/dashboard" && "text-primary")}
                        >
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => logout()} className="cursor-pointer hover:bg-muted">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="w-full cursor-pointer">
                        Login
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
