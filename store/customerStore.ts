import { create } from 'zustand'

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'momma-me-customers'

// Load customers from localStorage
const loadCustomers = (): Customer[] => {
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
    console.error('Error loading customers from localStorage:', e)
  }
  return []
}

// Save customers to localStorage
const saveCustomers = (customers: Customer[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
  } catch (e) {
    console.error('Error saving customers to localStorage:', e)
  }
}

interface CustomerStore {
  customers: Customer[]
  initialize: () => void
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalOrders' | 'totalSpent'>) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  getCustomer: (id: string) => Customer | undefined
  getCustomerByEmail: (email: string) => Customer | undefined
  getAllCustomers: () => Customer[]
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: loadCustomers(),

  initialize: () => {
    const loaded = loadCustomers()
    set({ customers: loaded })
  },

  addCustomer: (customerData) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const newCustomers = [...get().customers, newCustomer]
    set({ customers: newCustomers })
    saveCustomers(newCustomers)
  },

  updateCustomer: (id, updatedCustomer) => {
    const newCustomers = get().customers.map(c =>
      c.id === id ? { ...c, ...updatedCustomer, updatedAt: new Date().toISOString() } : c
    )
    set({ customers: newCustomers })
    saveCustomers(newCustomers)
  },

  deleteCustomer: (id) => {
    const newCustomers = get().customers.filter(c => c.id !== id)
    set({ customers: newCustomers })
    saveCustomers(newCustomers)
  },

  getCustomer: (id) => {
    return get().customers.find(c => c.id === id)
  },

  getCustomerByEmail: (email) => {
    return get().customers.find(c => c.email.toLowerCase() === email.toLowerCase())
  },

  getAllCustomers: () => {
    return get().customers
  },
}))



