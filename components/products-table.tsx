"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Package, Clock } from "lucide-react"
import { format, differenceInDays, parseISO } from "date-fns"
import { ru } from "date-fns/locale"
import { EditProductDialog } from "./edit-product-dialog"
import { DeleteProductDialog } from "./delete-product-dialog"
import { QuantityAdjuster } from "./quantity-adjuster"

interface Product {
  id: string
  name: string
  quantity: number
  expiration_date: string
  created_at: string
  updated_at: string
}

interface ProductsTableProps {
  products: Product[]
  onProductsChange: () => void
}

export function ProductsTable({ products: initialProducts, onProductsChange }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts)
  const router = useRouter()

  const handleProductUpdated = () => {
    onProductsChange()
  }

  const handleProductDeleted = () => {
    onProductsChange()
  }

  const handleQuantityUpdated = (productId: string, newQuantity: number) => {
    console.log("[v0] Updating local state for product", productId, "with quantity", newQuantity)
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: newQuantity, updated_at: new Date().toISOString() }
          : product,
      ),
    )
  }

  const getWarningStatus = (expirationDate: string, quantity: number) => {
    const daysUntilExpiration = differenceInDays(parseISO(expirationDate), new Date())

    if (daysUntilExpiration <= 0) {
      return { type: "expired", message: "Просрочен", variant: "destructive" as const, priority: 1 }
    } else if (daysUntilExpiration <= 3) {
      return { type: "expiring", message: "Истекает", variant: "destructive" as const, priority: 2 }
    } else if (quantity < 5) {
      return { type: "low-stock", message: "Мало товара", variant: "secondary" as const, priority: 3 }
    }

    return null
  }

  const getRowClassName = (expirationDate: string, quantity: number) => {
    const warning = getWarningStatus(expirationDate, quantity)
    if (warning?.type === "expired") {
      return "bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-800 hover:bg-red-150 dark:hover:bg-red-950/40"
    } else if (warning?.type === "expiring") {
      return "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-950/30"
    } else if (warning?.type === "low-stock") {
      return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-950/30"
    }
    return ""
  }

  const sortedProducts = [...products].sort((a, b) => {
    const warningA = getWarningStatus(a.expiration_date, a.quantity)
    const warningB = getWarningStatus(b.expiration_date, b.quantity)

    if (warningA && warningB) {
      return warningA.priority - warningB.priority
    } else if (warningA) {
      return -1
    } else if (warningB) {
      return 1
    }

    return differenceInDays(parseISO(a.expiration_date), parseISO(b.expiration_date))
  })

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{"Нет товаров"}</h3>
            <p className="text-muted-foreground mb-4">{"Добавьте первый товар, чтобы начать отслеживание"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {"Список товаров"}
          <Badge variant="secondary">{products.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Название товара"}</TableHead>
                <TableHead className="text-center">{"Количество"}</TableHead>
                <TableHead className="text-center">{"Срок годности"}</TableHead>
                <TableHead className="text-center">{"Статус"}</TableHead>
                <TableHead className="text-right">{"Действия"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => {
                const warning = getWarningStatus(product.expiration_date, product.quantity)
                const rowClassName = getRowClassName(product.expiration_date, product.quantity)
                const daysUntilExpiration = differenceInDays(parseISO(product.expiration_date), new Date())

                return (
                  <TableRow key={product.id} className={rowClassName}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {product.name}
                        {warning?.type === "expired" && (
                          <AlertCircle className="h-4 w-4 text-red-600 animate-pulse" title="Товар просрочен!" />
                        )}
                        {warning?.type === "expiring" && (
                          <Clock className="h-4 w-4 text-orange-600 animate-pulse" title="Срок годности истекает!" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-medium">{product.quantity}</span>
                          {product.quantity < 5 && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                        </div>
                        <QuantityAdjuster
                          productId={product.id}
                          productName={product.name}
                          currentQuantity={product.quantity}
                          onQuantityUpdated={(newQuantity) => handleQuantityUpdated(product.id, newQuantity)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {format(parseISO(product.expiration_date), "dd.MM.yyyy", { locale: ru })}
                        {daysUntilExpiration <= 3 && daysUntilExpiration > 0 && (
                          <span className="text-xs text-orange-600 ml-1">
                            ({daysUntilExpiration} {daysUntilExpiration === 1 ? "день" : "дня"})
                          </span>
                        )}
                        {daysUntilExpiration <= 0 && (
                          <span className="text-xs text-red-600 ml-1 font-medium">(просрочен)</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {warning ? (
                        <Badge variant={warning.variant}>{warning.message}</Badge>
                      ) : (
                        <Badge variant="outline">{"В порядке"}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <EditProductDialog product={product} onProductUpdated={handleProductUpdated} />
                        <DeleteProductDialog
                          productId={product.id}
                          productName={product.name}
                          onProductDeleted={handleProductDeleted}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
