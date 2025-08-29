"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Package, Calendar, BarChart3 } from "lucide-react"
import { startOfDay, subDays, isAfter } from "date-fns"

interface Sale {
  id: string
  product_name: string
  quantity_sold: number
  sale_date: string
}

interface SalesStatsProps {
  sales: Sale[]
}

export default function SalesStats({ sales }: SalesStatsProps) {
  const stats = useMemo(() => {
    const today = startOfDay(new Date())
    const yesterday = startOfDay(subDays(new Date(), 1))
    const weekAgo = startOfDay(subDays(new Date(), 7))

    // Total sales
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity_sold, 0)

    // Today's sales
    const todaySales = sales.filter((sale) => isAfter(new Date(sale.sale_date), today))
    const todayQuantity = todaySales.reduce((sum, sale) => sum + sale.quantity_sold, 0)

    // This week's sales
    const weekSales = sales.filter((sale) => isAfter(new Date(sale.sale_date), weekAgo))
    const weekQuantity = weekSales.reduce((sum, sale) => sum + sale.quantity_sold, 0)

    // Most sold product
    const productSales = sales.reduce(
      (acc, sale) => {
        acc[sale.product_name] = (acc[sale.product_name] || 0) + sale.quantity_sold
        return acc
      },
      {} as Record<string, number>,
    )

    const mostSoldProduct = Object.entries(productSales).sort(([, a], [, b]) => b - a)[0]

    return {
      totalQuantity,
      todayQuantity,
      weekQuantity,
      mostSoldProduct: mostSoldProduct
        ? {
            name: mostSoldProduct[0],
            quantity: mostSoldProduct[1],
          }
        : null,
    }
  }, [sales])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всего продано</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalQuantity}</div>
          <p className="text-xs text-muted-foreground">товаров за все время</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Сегодня</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayQuantity}</div>
          <p className="text-xs text-muted-foreground">товаров продано сегодня</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">За неделю</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.weekQuantity}</div>
          <p className="text-xs text-muted-foreground">товаров за последние 7 дней</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Популярный товар</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats.mostSoldProduct ? (
            <>
              <div className="text-2xl font-bold">{stats.mostSoldProduct.quantity}</div>
              <p className="text-xs text-muted-foreground truncate">{stats.mostSoldProduct.name}</p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">нет данных</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
