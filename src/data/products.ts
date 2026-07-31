import type { Product } from '../types/product'

export const products: Product[] = [
  {
    id: 'mv-001',
    name: 'Linen Overshirt',
    category: 'shirts',
    description:
      'A relaxed linen overshirt with a clean collar and soft structure. Layer over tees or wear open for an easy smart-casual look.',
    price: 189,
    mainImage:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [
      { name: 'Sand', hex: '#C8B9A6' },
      { name: 'Ivory', hex: '#F2EDE6' },
      { name: 'Olive', hex: '#6B705C' },
    ],
    material: '100% European linen',
    careInstructions: 'Gentle cold wash. Hang dry. Warm iron if needed.',
    featured: true,
    newArrival: true,
    available: true,
  },
  {
    id: 'mv-002',
    name: 'Essential Cotton Tee',
    category: 't-shirts',
    description:
      'A refined everyday tee cut from dense combed cotton. Soft hand-feel with a clean crew neck and precise shoulder line.',
    price: 89,
    mainImage:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Stone', hex: '#A8A29E' },
    ],
    material: '220gsm combed cotton',
    careInstructions: 'Machine wash cold. Do not tumble dry. Cool iron.',
    featured: true,
    newArrival: true,
    available: true,
  },
  {
    id: 'mv-003',
    name: 'Tailored Chino Trousers',
    category: 'pants',
    description:
      'Streamlined chino trousers with a soft taper and comfortable mid-rise. Designed for all-day wear from desk to dinner.',
    price: 219,
    mainImage:
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506629082955-511b1aa782c0?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [
      { name: 'Khaki', hex: '#B7A78D' },
      { name: 'Navy', hex: '#2C3E50' },
      { name: 'Charcoal', hex: '#4A4A4A' },
    ],
    material: '98% cotton, 2% elastane',
    careInstructions: 'Machine wash cold inside out. Hang dry. Steam to refresh.',
    featured: true,
    newArrival: false,
    available: true,
  },
  {
    id: 'mv-004',
    name: 'Wool-Blend Overcoat',
    category: 'outerwear',
    description:
      'An understated overcoat with a fluid drape and minimal lapel. Built for cooler evenings and polished layering.',
    price: 489,
    mainImage:
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colours: [
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    material: '70% wool, 30% polyester blend',
    careInstructions: 'Dry clean only. Store on a wide hanger.',
    featured: true,
    newArrival: true,
    available: true,
  },
  {
    id: 'mv-005',
    name: 'Oxford Button-Down',
    category: 'shirts',
    description:
      'A classic Oxford shirt with a soft collar and clean placket. The everyday foundation of a refined wardrobe.',
    price: 169,
    mainImage:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1563630423918-b58f07336ac5?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [
      { name: 'Sky', hex: '#B8C9D6' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Soft Pink', hex: '#E8D5D0' },
    ],
    material: '100% cotton Oxford',
    careInstructions: 'Machine wash cold. Iron while slightly damp.',
    featured: false,
    newArrival: true,
    available: true,
  },
  {
    id: 'mv-006',
    name: 'Relaxed Merino Crew',
    category: 't-shirts',
    description:
      'A fine-gauge merino crew knit that feels light against the skin. Breathable, temperature-regulating and quietly luxurious.',
    price: 159,
    mainImage:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colours: [
      { name: 'Oatmeal', hex: '#D9CBB8' },
      { name: 'Forest', hex: '#3D4F3F' },
      { name: 'Ink', hex: '#2B2B2B' },
    ],
    material: '100% extra-fine merino wool',
    careInstructions: 'Hand wash cold or dry clean. Lay flat to dry.',
    featured: true,
    newArrival: false,
    available: true,
  },
  {
    id: 'mv-007',
    name: 'Wide-Leg Pleated Trousers',
    category: 'pants',
    description:
      'Fluid wide-leg trousers with soft front pleats. A modern silhouette that moves with ease and photographs beautifully.',
    price: 249,
    mainImage:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506629082955-511b1aa782c0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colours: [
      { name: 'Ivory', hex: '#F0EBE3' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Taupe', hex: '#8B7E74' },
    ],
    material: '65% polyester, 30% rayon, 5% elastane',
    careInstructions: 'Gentle wash cold. Hang dry. Steam lightly.',
    featured: false,
    newArrival: true,
    available: true,
  },
  {
    id: 'mv-008',
    name: 'Structured Blazer',
    category: 'outerwear',
    description:
      'A soft-shouldered blazer with a lightly structured chest. Transition seamlessly from meetings to evenings out.',
    price: 399,
    mainImage:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [
      { name: 'Charcoal', hex: '#3F3F3F' },
      { name: 'Navy', hex: '#1E2A3A' },
    ],
    material: 'Wool-blend with satin lining',
    careInstructions: 'Dry clean only. Steam between wears.',
    featured: true,
    newArrival: false,
    available: false,
  },
  {
    id: 'mv-009',
    name: 'Utility Field Jacket',
    category: 'outerwear',
    description:
      'A lightweight field jacket with clean pocket detailing and a matte finish. Practical layering without visual noise.',
    price: 329,
    mainImage:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1548126032-077b8ce795ee?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [
      { name: 'Olive', hex: '#5C6648' },
      { name: 'Stone', hex: '#A39E93' },
    ],
    material: 'Cotton-nylon technical blend',
    careInstructions: 'Machine wash cold. Hang dry. Do not bleach.',
    featured: false,
    newArrival: true,
    available: true,
  },
]
