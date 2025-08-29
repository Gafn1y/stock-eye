"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getSales } from "@/lib/storage"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SalesTable from "@/components/sales-table"
import SalesStats from "@/components/sales-stats"

interface Sale {
  id: string
  product_name: string
  quantity_sold: number
  sale_date: string
}

export default function SalesPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [sales, setSales] = useState<Sale[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
    } else {
      setUser(currentUser)
      setSales(getSales())
    }
  }, [router])

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к товарам
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Статистика продаж</h1>
              <p className="text-gray-600">Отслеживайте продажи и анализируйте результаты</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <SalesStats sales={sales} />

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              История продаж
            </CardTitle>
            <CardDescription>Полная история всех продаж товаров</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesTable sales={sales} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
