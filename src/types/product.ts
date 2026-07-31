export type ProductCategory =
  | 'shirts'
  | 't-shirts'
  | 'pants'
  | 'outerwear'

export type ProductColour = {
  name: string
  hex: string
}

export type Product = {
  id: string
  name: string
  category: ProductCategory
  description: string
  price: number
  mainImage: string
  images: string[]
  sizes: string[]
  colours: ProductColour[]
  material: string
  careInstructions: string
  featured: boolean
  newArrival: boolean
  available: boolean
}

export type FilterOption =
  | 'all'
  | 'new-arrivals'
  | ProductCategory
