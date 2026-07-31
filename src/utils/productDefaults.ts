import type { Product, ProductCategory } from '../types/product'

export function createEmptyProduct(
  category: ProductCategory = 'shirts',
): Product {
  const id = `mv-${Date.now().toString(36)}`
  return {
    id,
    name: 'New Product',
    category,
    description: '',
    price: 0,
    mainImage: '',
    images: [''],
    sizes: ['S', 'M', 'L', 'XL'],
    colours: [{ name: 'Black', hex: '#1A1A1A' }],
    material: '',
    careInstructions: '',
    featured: false,
    newArrival: true,
    available: true,
  }
}
