"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, TrendingDown } from "lucide-react"
import { differenceInDays, parseISO } from "date-fns"

interface Product {
  id: string
  name: string
  quantity: number
  expiration_date: string
}

interface WarningSummaryProps {
  products: Product[]
}

export function WarningSummary({ products }: WarningSummaryProps) {
  const warnings = products.reduce(
    (acc, product) => {
      const daysUntilExpiration = differenceInDays(parseISO(product.expiration_date), new Date())

      if (daysUntilExpiration <= 0) {
        acc.expired.push(product)
      } else if (daysUntilExpiration <= 3) {
        acc.expiring.push(product)
      }

      if (product.quantity < 5) {
        acc.lowStock.push(product)
      }

      return acc
    },
    { expired: [] as Product[], expiring: [] as Product[], lowStock: [] as Product[] },
  )

  const totalWarnings = warnings.expired.length + warnings.expiring.length + warnings.lowStock.length

  if (totalWarnings === 0) {
    return (
      <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
        <CardContent className="flex items-center gap-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-200">{"Все товары в порядке"}</h3>
            <p className="text-sm text-green-600 dark:text-green-400">
              {"Нет товаров с истекающим сроком годности или низкими остатками"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 mb-6 md:grid-cols-3">
      {/* Expired Products */}
      {warnings.expired.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-red-800 dark:text-red-200">{"Просроченные"}</h3>
                <Badge variant="destructive">{warnings.expired.length}</Badge>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">
                {warnings.expired.length === 1 ? "товар просрочен" : "товаров просрочено"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expiring Soon */}
      {warnings.expiring.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-orange-800 dark:text-orange-200">{"Истекает скоро"}</h3>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200"
                >
                  {warnings.expiring.length}
                </Badge>
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400">{"Срок годности ≤ 3 дней"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Low Stock */}
      {warnings.lowStock.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <TrendingDown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">{"Мало товара"}</h3>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                >
                  {warnings.lowStock.length}
                </Badge>
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">{"Количество < 5 единиц"}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
