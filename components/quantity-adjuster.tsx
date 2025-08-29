"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"
import { updateProduct, addSale, getCurrentUser } from "@/lib/storage"

interface QuantityAdjusterProps {
  productId: string
  productName: string // Added product name for sales recording
  currentQuantity: number
  onQuantityUpdated: (newQuantity: number) => void
}

export function QuantityAdjuster({
  productId,
  productName,
  currentQuantity,
  onQuantityUpdated,
}: QuantityAdjusterProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [sellAmount, setSellAmount] = useState(1)
  const [showSellInput, setShowSellInput] = useState(false)

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 0) return

    setIsUpdating(true)
    try {
      console.log("[v0] Updating quantity for product:", productId, "to:", newQuantity)

      const updatedProduct = updateProduct(productId, {
        quantity: newQuantity,
      })

      if (!updatedProduct) {
        console.error("[v0] Error updating quantity: Product not found")
        return
      }

      console.log("[v0] Quantity updated successfully, calling onQuantityUpdated with:", newQuantity)
      onQuantityUpdated(newQuantity)
    } catch (error) {
      console.error("[v0] Error updating quantity:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const recordSale = async (quantitySold: number) => {
    try {
      const user = getCurrentUser()
      if (!user) return

      addSale({
        product_id: productId,
        product_name: productName,
        quantity_sold: quantitySold,
      })

      console.log("[v0] Sale recorded successfully:", { productName, quantitySold })
    } catch (error) {
      console.error("[v0] Error recording sale:", error)
    }
  }

  const handleSell = async () => {
    const newQuantity = Math.max(0, currentQuantity - sellAmount)
    await updateQuantity(newQuantity)
    await recordSale(sellAmount)
    setSellAmount(1)
    setShowSellInput(false)
  }

  return (
    <div className="flex items-center gap-1">
      {/* Quick +/- buttons */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => updateQuantity(currentQuantity - 1)}
        disabled={isUpdating || currentQuantity <= 0}
        className="h-8 w-8 p-0"
      >
        <Minus className="h-3 w-3" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => updateQuantity(currentQuantity + 1)}
        disabled={isUpdating}
        className="h-8 w-8 p-0"
      >
        <Plus className="h-3 w-3" />
      </Button>

      {!showSellInput ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSellInput(true)}
          disabled={isUpdating || currentQuantity <= 0}
          className="h-8 px-2 text-xs"
        >
          Продать
        </Button>
      ) : (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min="1"
            max={currentQuantity}
            value={sellAmount}
            onChange={(e) =>
              setSellAmount(Math.max(1, Math.min(currentQuantity, Number.parseInt(e.target.value) || 1)))
            }
            className="h-8 w-12 text-xs"
          />
          <Button variant="default" size="sm" onClick={handleSell} disabled={isUpdating} className="h-8 px-2 text-xs">
            ОК
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowSellInput(false)
              setSellAmount(1)
            }}
            className="h-8 px-1"
          >
            ✕
          </Button>
        </div>
      )}
    </div>
  )
}
