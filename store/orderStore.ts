import { create } from 'zustand'
import { Product } from './cartStore'

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    address: string
    city: string
    state: string
    zip: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingMethod: 'standard' | 'express' | 'overnight'
  paymentMethod: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'momma-me-orders'

// Load orders from localStorage
const loadOrders = (): Order[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Error loading orders from localStorage:', e)
  }
  return []
}

// Save orders to localStorage
const saveOrders = (orders: Order[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch (e) {
    console.error('Error saving orders to localStorage:', e)
  }
}

interface OrderStore {
  orders: Order[]
  initialize: () => void
  addOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>) => Order
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  getOrder: (orderId: string) => Order | undefined
  getAllOrders: () => Order[]
  getOrdersByStatus: (status: Order['status']) => Order[]
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: loadOrders(),

  initialize: () => {
    const loaded = loadOrders()
    set({ orders: loaded })
  },

  addOrder: (orderData) => {
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const newOrders = [...get().orders, newOrder]
    set({ orders: newOrders })
    saveOrders(newOrders)
    return newOrder
  },

  updateOrderStatus: (orderId, status) => {
    const newOrders = get().orders.map(o =>
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    )
    set({ orders: newOrders })
    saveOrders(newOrders)
  },

  getOrder: (orderId) => {
    return get().orders.find(o => o.id === orderId)
  },

  getAllOrders: () => {
    return get().orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  getOrdersByStatus: (status) => {
    return get().orders.filter(o => o.status === status)
  },
}))



