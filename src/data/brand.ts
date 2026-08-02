/**
 * Update these values with your real brand contact details.
 */
export const brand = {
  name: 'Marvolo',
  tagline: 'Timeless Style. Made for Every Occasion.',
  description:
    'Discover premium clothing designed for effortless confidence, comfort and everyday sophistication.',
  story:
    'At Marvolo, we create timeless clothing that combines comfort, quality and understated elegance. Every piece is designed to become a lasting part of your everyday wardrobe — refined enough for special moments, effortless enough for everyday wear.',
  philosophy:
    'Inspired by modern smart-casual dressing, Marvolo focuses on clean silhouettes, premium fabrics and lasting craftsmanship.',
  // Defaults used until admin overrides in Supabase (country code, no + or spaces)
  whatsappNumber: '60123456789',
  whatsappDisplay: '+60 12-345 6789',
  whatsappContacts: [
    { label: 'Line 1', number: '60123456789', display: '+60 12-345 6789' },
    { label: 'Line 2', number: '', display: '' },
    { label: 'Line 3', number: '', display: '' },
  ],
  instagramUrl: 'https://www.instagram.com/marvolodraco.mvd?igsh=dWtydWxoZzNkM2Rz',
  instagramHandle: '@marvolo',
  email: 'marvolodraco.mvd@gmail.com',
  heroImage:
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80',
  aboutImage:
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1600&q=80',
} as const
