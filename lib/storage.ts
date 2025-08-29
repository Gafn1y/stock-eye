export interface Product {
  id: string
  name: string
  quantity: number
  expiration_date: string
  created_at: string
  user_id: string
}

export interface Sale {
  id: string
  product_id: string
  product_name: string
  quantity_sold: number
  sale_date: string
  user_id: string
}

const PRODUCTS_KEY = "stockeye_products"
const SALES_KEY = "stockeye_sales"
const USER_KEY = "stockeye_user"

// User management
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export const setCurrentUser = (user: { id: string; email: string }) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const signOut = () => {
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(PRODUCTS_KEY)
  localStorage.removeItem(SALES_KEY)
}

// Products management
export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return []
  const products = localStorage.getItem(PRODUCTS_KEY)
  return products ? JSON.parse(products) : []
}

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export const addProduct = (product: Omit<Product, "id" | "created_at" | "user_id">) => {
  const products = getProducts()
  const user = getCurrentUser()
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    user_id: user?.id || "anonymous",
  }
  products.push(newProduct)
  saveProducts(products)
  return newProduct
}

export const updateProduct = (id: string, updates: Partial<Product>) => {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates }
    saveProducts(products)
    return products[index]
  }
  return null
}

export const deleteProduct = (id: string) => {
  const products = getProducts()
  const filtered = products.filter((p) => p.id !== id)
  saveProducts(filtered)
}

// Sales management
export const getSales = (): Sale[] => {
  if (typeof window === "undefined") return []
  const sales = localStorage.getItem(SALES_KEY)
  return sales ? JSON.parse(sales) : []
}

export const saveSales = (sales: Sale[]) => {
  localStorage.setItem(SALES_KEY, JSON.stringify(sales))
}

export const addSale = (sale: Omit<Sale, "id" | "sale_date" | "user_id">) => {
  const sales = getSales()
  const user = getCurrentUser()
  const newSale: Sale = {
    ...sale,
    id: Date.now().toString(),
    sale_date: new Date().toISOString(),
    user_id: user?.id || "anonymous",
  }
  sales.push(newSale)
  saveSales(sales)
  return newSale
}
