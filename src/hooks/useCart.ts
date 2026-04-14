'use client'

import { useState, useEffect, useCallback } from 'react'
import { CartItem } from '@/types'

const CART_KEY = 'kahuyshop_cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    }
  }, [items, loaded])

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const existing = prev.findIndex(
        i => i.productId === item.productId && i.size === item.size && i.color === item.color
      )
      if (existing >= 0) {
        return prev.map((i, idx) =>
          idx === existing ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prev, item]
    })
  }, [])

  const updateQuantity = useCallback((productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(
        i => !(i.productId === productId && i.size === size && i.color === color)
      ))
    } else {
      setItems(prev => prev.map(i =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      ))
    }
  }, [])

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    setItems(prev => prev.filter(
      i => !(i.productId === productId && i.size === size && i.color === color)
    ))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return { items, total, count, addItem, updateQuantity, removeItem, clearCart, loaded }
}
