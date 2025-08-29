"use client"

import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Sale {
  id: string
  product_name: string
  quantity_sold: number
  sale_date: string
}

interface SalesTableProps {
  sales: Sale[]
}

export default function SalesTable({ sales }: SalesTableProps) {
  if (sales.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Пока нет данных о продажах</p>
        <p className="text-sm text-gray-400 mt-1">
          Продажи будут отображаться здесь после использования функции "Продать" в таблице товаров
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Товар</TableHead>
            <TableHead>Количество</TableHead>
            <TableHead>Дата продажи</TableHead>
            <TableHead>Время</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.product_name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{sale.quantity_sold} шт.</Badge>
              </TableCell>
              <TableCell>{format(new Date(sale.sale_date), "dd MMMM yyyy", { locale: ru })}</TableCell>
              <TableCell className="text-gray-500">{format(new Date(sale.sale_date), "HH:mm")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
