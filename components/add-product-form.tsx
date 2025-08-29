"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addProduct } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface AddProductFormProps {
  userId: string
}

export function AddProductForm({ userId }: AddProductFormProps) {
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      addProduct({
        name: name.trim(),
        quantity: Number.parseInt(quantity),
        expiration_date: expirationDate,
      })

      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Произошла ошибка")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {"Информация о товаре"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">{"Название товара"}</Label>
            <Input
              id="name"
              type="text"
              placeholder="Например: Молоко, Хлеб, Яблоки"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">{"Количество"}</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              placeholder="0"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expiration-date">{"Срок годности"}</Label>
            <Input
              id="expiration-date"
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
              {isLoading ? "Добавление..." : "Добавить товар"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={isLoading}>
              {"Отмена"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
