"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, signOut, getProducts } from "@/lib/storage"
import { ProductsTable } from "@/components/products-table"
import { WarningSummary } from "@/components/warning-summary"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
    } else {
      setUser(currentUser)
      setProducts(getProducts())
    }
  }, [router])

  const handleSignOut = () => {
    signOut()
    router.push("/auth/login")
  }

  const refreshProducts = () => {
    setProducts(getProducts())
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">StockEye</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                {"Выйти"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-balance">{"Управление товарами"}</h2>
            <p className="text-muted-foreground">{"Отслеживайте остатки и сроки годности ваших товаров"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/sales">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Package className="h-4 w-4" />
                {"Статистика продаж"}
              </Button>
            </Link>
            <Link href="/dashboard/add-product">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {"Добавить товар"}
              </Button>
            </Link>
          </div>
        </div>

        <WarningSummary products={products} />
        <ProductsTable products={products} onProductsChange={refreshProducts} />
      </main>
    </div>
  )
}
