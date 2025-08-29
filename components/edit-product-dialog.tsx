"use client"

import type React from "react"

import { useState } from "react"
import { updateProduct } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from "lucide-react"
import { format } from "date-fns"

interface Product {
  id: string
  name: string
  quantity: number
  expiration_date: string
}

interface EditProductDialogProps {
  product: Product
  onProductUpdated: () => void
}

export function EditProductDialog({ product, onProductUpdated }: EditProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(product.name)
  const [quantity, setQuantity] = useState(product.quantity.toString())
  const [expirationDate, setExpirationDate] = useState(format(new Date(product.expiration_date), "yyyy-MM-dd"))
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      updateProduct(product.id, {
        name: name.trim(),
        quantity: Number.parseInt(quantity),
        expiration_date: expirationDate,
      })

      setOpen(false)
      onProductUpdated()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Произошла ошибка")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{"Редактировать товар"}</DialogTitle>
          <DialogDescription>{"Внесите изменения в информацию о товаре"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">{"Название товара"}</Label>
            <Input id="edit-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-quantity">{"Количество"}</Label>
            <Input
              id="edit-quantity"
              type="number"
              min="0"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-expiration-date">{"Срок годности"}</Label>
            <Input
              id="edit-expiration-date"
              type="date"
              required
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              {"Отмена"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
