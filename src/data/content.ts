export const reviews = [
  {
    id: 1,
    name: 'Aisha Rahman',
    rating: 5,
    text: 'The linen overshirt feels incredible and looks even better in person. Ordering through WhatsApp was simple and personal.',
  },
  {
    id: 2,
    name: 'Daniel Tan',
    rating: 5,
    text: 'Clean cuts, premium fabrics and a fit that works for everyday wear. Marvolo has become my go-to for smart-casual pieces.',
  },
  {
    id: 3,
    name: 'Sofia Lim',
    rating: 5,
    text: 'I love how understated everything feels. The quality is obvious and the team helped me choose the right size over WhatsApp.',
  },
  {
    id: 4,
    name: 'Hafiz Omar',
    rating: 4,
    text: 'Beautiful trousers and fast replies. The whole experience felt more thoughtful than a typical online shop.',
  },
] as const

export const faqs = [
  {
    question: 'How do I place an order?',
    answer:
      'Browse the collection, open a product, select your preferred colour and size, then tap “Order via WhatsApp”. A pre-filled message will open so you can confirm the item with us directly.',
  },
  {
    question: 'How do I make payment?',
    answer:
      'Payment instructions are shared privately through WhatsApp once your order details are confirmed. There is no online checkout or payment gateway on this website.',
  },
  {
    question: 'What sizes are available?',
    answer:
      'Most pieces are available in S to XXL. Please refer to our Size Guide for chest, shoulder, sleeve and length measurements, or message us on WhatsApp for fit advice.',
  },
  {
    question: 'Can I exchange an item?',
    answer:
      'Exchanges may be arranged depending on availability and condition. Contact us on WhatsApp within 7 days of receiving your order and we will guide you through the process.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Delivery timelines vary by location and stock availability. Once your order is confirmed on WhatsApp, we will share the estimated shipping time and tracking details.',
  },
  {
    question: 'How can I check product availability?',
    answer:
      'Availability is shown on each product listing. For the latest stock updates, send us a WhatsApp message with the product name, colour and size you need.',
  },
] as const

export const sizeGuide = [
  { size: 'S', chest: '96–100', shoulder: '42', sleeve: '62', length: '70' },
  { size: 'M', chest: '100–104', shoulder: '44', sleeve: '63', length: '72' },
  { size: 'L', chest: '104–108', shoulder: '46', sleeve: '64', length: '74' },
  { size: 'XL', chest: '108–114', shoulder: '48', sleeve: '65', length: '76' },
  { size: 'XXL', chest: '114–120', shoulder: '50', sleeve: '66', length: '78' },
] as const

export const lookbookImages = [
  {
    src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
    alt: 'Editorial look featuring tailored outerwear',
    span: 'tall' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80',
    alt: 'Lifestyle street style lookbook image',
    span: 'wide' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    alt: 'Model wearing contemporary smart-casual outfit',
    span: 'normal' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80',
    alt: 'Close-up of premium fabric and silhouette',
    span: 'normal' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&q=80',
    alt: 'Menswear campaign lookbook portrait',
    span: 'tall' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
    alt: 'Minimal fashion lookbook composition',
    span: 'wide' as const,
  },
]
