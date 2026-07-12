const allProducts = [
  {
    id: 'pudina-capsules',
    badge: 'save 27%',
    name: 'Pudina Capsules',
    rating: 5,
    price: 399,
    originalPrice: 549,
    category: 'Digestive Care',
    image: '/images/products/pudina-capsules.png',
    summary: 'Digestive and cooling support for everyday gut comfort.',
    benefits: [
      'Relieves indigestion and acidity',
      'Helps reduce bloating after meals',
      'Supports fresh breath and lightness',
    ],
    tags: ['Pickup', 'Delivery'],
  },
  {
    id: 'mulethi-powder',
    badge: 'save 30%',
    name: 'Mulethi Powder',
    rating: 4,
    price: 349,
    originalPrice: 499,
    category: 'Respiratory Care',
    image: '/images/products/mulethi-powder.png',
    summary: 'Soothing throat and respiratory support in a daily powder.',
    benefits: [
      'Soothes cough and sore throat',
      'Helps respiratory comfort',
      'Useful in seasonal wellness routines',
    ],
    tags: ['Pickup', 'Delivery'],
  },
  {
    id: 'haritaki-powder',
    badge: 'save 28%',
    name: 'Haritaki Powder',
    rating: 4,
    price: 359,
    originalPrice: 499,
    category: 'Digestive Care',
    image: '/images/products/haritaki-powder.png',
    summary: 'Colon cleanser and detox support for balanced digestion.',
    benefits: [
      'Supports digestion and regularity',
      'Helps natural detox routines',
      'Useful for gut wellness support',
    ],
    tags: ['Pickup', 'Delivery'],
  },
  {
    id: 'amla-powder',
    badge: 'save 31%',
    name: 'Amla Powder',
    rating: 5,
    price: 379,
    originalPrice: 549,
    category: 'Immunity Care',
    image: '/images/products/amla-powder.png',
    summary: 'Vitamin-rich amla support for immunity, hair and skin health.',
    benefits: [
      'Boosts immunity naturally',
      'Supports hair and skin glow',
      'Powerful antioxidant support',
    ],
    tags: ['Pickup', 'Delivery'],
  },
  {
    id: 'shilajit-capsules',
    badge: 'save 31%',
    name: 'Shilajit Capsules',
    rating: 5,
    price: 899,
    originalPrice: 1299,
    category: "Men's Health",
    image: '/images/products/shilajit-capsules.png',
    summary: 'Energy and stamina support with a focused daily capsule format.',
    benefits: [
      'Boosts energy and stamina',
      'Supports strength and performance',
      'Helps improve vitality',
    ],
    tags: ['Pickup', 'Delivery'],
  },
  {
    id: 'triphala-powder',
    badge: 'save 31%',
    name: 'Triphala Powder',
    rating: 4,
    price: 329,
    originalPrice: 479,
    category: 'Digestive Care',
    image: '/images/products/triphala-powder.png',
    summary: 'Digestive health support with the classic triphala blend.',
    benefits: [
      'Improves digestion gently',
      'Supports natural detox',
      'Good for daily gut balance',
    ],
    tags: ['Pickup', 'Delivery'],
  },
  {
    id: 'neem-capsules',
    badge: 'save 28%',
    name: 'Neem Capsules',
    rating: 4,
    price: 429,
    originalPrice: 599,
    category: 'Skin Care',
    image: '/images/products/neem-capsules.png',
    summary: 'Blood and skin wellness support with neem-based capsules.',
    benefits: [
      'Purifies blood support',
      'Helps healthy skin routines',
      'Supports immunity and cleansing',
    ],
    tags: ['Pickup', 'Delivery'],
  },
  {
    id: 'giloy-capsules',
    badge: 'save 30%',
    name: 'Giloy Capsules',
    rating: 5,
    price: 449,
    originalPrice: 649,
    category: 'Immunity Care',
    image: '/images/products/giloy-capsules.png',
    summary: 'Immunity and wellness support in an easy daily capsule.',
    benefits: [
      'Enhances immunity naturally',
      'Supports anti-fatigue wellness',
      'Good for year-round vitality',
    ],
    tags: ['Pickup', 'Delivery'],
  },
  {
    id: 'safed-musli-capsules',
    badge: 'save 33%',
    name: 'Safed Musli Capsules',
    rating: 5,
    price: 999,
    originalPrice: 1499,
    category: 'Vitality Care',
    image: '/images/products/safed-musli-capsules.png',
    summary: 'Strength and vitality support with a premium daily capsule.',
    benefits: [
      'Supports strength and stamina',
      'Useful for reproductive wellness',
      'Helps daily energy balance',
    ],
    tags: ['Pickup', 'Delivery'],
  },
]

const shopThemes = ['sage', 'blush', 'gold', 'mint', 'lavender', 'sky']

const shopProducts = [
  ...allProducts,
  ...allProducts.map((product, index) => ({
    ...product,
    id: `${product.id}-value-pack`,
    name: `${product.name} Value Pack`,
    price: product.price + 140 + index * 20,
    originalPrice: product.originalPrice + 220 + index * 28,
    summary: `${product.summary} Extra value pack for regular wellness routines.`,
    badge: product.badge ?? 'save 18%',
  })),
].map((product, index) => ({
  ...product,
  reviewCount: 8 + index * 3,
  createdAt: `2026-07-${String((index % 9) + 1).padStart(2, '0')}`,
  inStock: true,
  onSale: Boolean(product.badge),
  visualTheme: shopThemes[index % shopThemes.length],
}))

const stories = [
  {
    id: 'rajat',
    stars: 5,
    quote:
      "My fiance and I had plans for valentine's that went refreshingly great after consuming these capsules.",
    author: 'Rajat',
  },
  {
    id: 'rupesh',
    stars: 5,
    quote:
      'Very effective. I felt energized after consuming it for 3-4 days only. ST Herbal always stands true to its quality.',
    author: 'Rupesh',
  },
  {
    id: 'ankur',
    stars: 5,
    quote:
      'After using this shilajit range, I do not feel lethargic even after long work hours and I saw steady improvement.',
    author: 'Ankur Tanwar',
  },
  {
    id: 'rajnish',
    stars: 5,
    quote:
      'I could see a decent performance increase. Would surely recommend it.',
    author: 'Rajnish',
  },
]

const aboutPromiseCards = [
  {
    id: 'vision',
    title: 'Our Vision',
    text:
      'At ST Herbal India, our vision is to guide modern families toward balanced, nature-led wellness through trusted Ayurvedic care.',
  },
  {
    id: 'mission',
    title: 'Our Mission',
    text:
      'Our mission is to blend traditional herbal knowledge with quality sourcing so every product supports daily wellbeing with confidence.',
  },
  {
    id: 'promise',
    title: 'Our Promise',
    text:
      'We promise purity, consistency, and customer-first service in every capsule, powder, and wellness formula we create.',
  },
]

const aboutValueItems = [
  {
    id: 'natural',
    number: '01',
    title: 'Natural is good',
    text: 'Every formula is designed around clean herbal ingredients and a gentle daily wellness experience.',
  },
  {
    id: 'health',
    number: '02',
    title: 'Here for your health',
    text: 'Our products combine Ayurvedic wisdom with practical routines that fit modern lifestyles.',
  },
  {
    id: 'shortcuts',
    number: '03',
    title: 'No shortcuts',
    text: 'We focus on trusted sourcing, quality checks, and simple transparent care from start to finish.',
  },
]

const aboutBlogPosts = [
  {
    id: 'product-spotlight',
    date: 'July 26, 2025',
    author: 'By Admin',
    title: 'Best Herbal Product in India for Natural Wellness | 100% Ayurvedic',
    image: '/images/products/amla-powder.png',
  },
  {
    id: 'stress-care',
    date: 'July 9, 2026',
    author: 'By Dr. Mohd Suhail',
    title: 'Why stress and fatigue rise in daily life and how Ayurveda supports balance naturally.',
    image: '/images/categories/skin-care.avif',
  },
  {
    id: 'daily-wellness',
    date: 'July 8, 2026',
    author: 'By Dr. Mohd Suhail',
    title: 'How herbal routines can support ear care, skin comfort, and immunity every day.',
    image: '/images/categories/mens-health.avif',
  },
]

export const homepageData = {
  promoBar: {
    note: 'For expert consultation talk to the expert instantly',
    phone: '+91 7878463670',
    highlight: 'Over 100k happy customers',
  },
  header: {
    brand: 'ST Herbal India',
    categoriesLabel: 'Categories',
    searchPlaceholder: 'What are you looking for ?',
    primaryLinks: ['Home', 'Shop', 'About Us', 'Contact'],
    shortcuts: [
      { id: 'track-orders', label: 'Track your orders', icon: 'truck' },
      { id: 'account', label: 'Account', icon: 'user' },
      { id: 'cart', label: 'Cart', icon: 'bag' },
    ],
    infoPills: [
      { id: 'hot-deals', label: 'Hot Deals', icon: 'spark' },
      { id: 'support', label: 'Call support: (+91)7878463670', icon: 'phone' },
    ],
  },
  hero: {
    title: 'Ashwagandha',
    subtitle: 'For Stress & Immunity',
    slides: [
      {
        id: 'shilajit',
        title: 'Performance Enhancer',
        subtitle: 'From Himalayas',
        image: '/images/hero-banner-shilajit-final.png',
        alt: 'Shilajit performance enhancer banner from Himalayas',
      },
      {
        id: 'ashwagandha',
        title: 'Ashwagandha',
        subtitle: 'For Stress & Immunity',
        image: '/images/hero-banner-ashwagandha-final.png',
        alt: 'Ashwagandha banner for stress and immunity',
      },
    ],
  },
  categories: [
    {
      id: 'digestive',
      title: 'Digestive Care',
      subtitle: 'Gut balance',
      image: '/images/categories/digestive-care.avif',
      tone: 'mint',
    },
    {
      id: 'men-health',
      title: "Men's Health",
      subtitle: 'Strength support',
      image: '/images/categories/mens-health.avif',
      tone: 'sand',
    },
    {
      id: 'immunity',
      title: 'Immunity Care',
      subtitle: 'Daily defence',
      image: '/images/categories/immunity-care.avif',
      tone: 'peach',
    },
    {
      id: 'respiratory',
      title: 'Hair Care',
      subtitle: 'Healthy roots and shine',
      image: '/images/categories/respiratory-care.avif',
      tone: 'cloud',
    },
    {
      id: 'skin-care',
      title: 'Skin Care',
      subtitle: 'Natural radiance',
      image: '/images/categories/skin-care.avif',
      tone: 'rose',
    },
    {
      id: 'vitality',
      title: 'Weight Management',
      subtitle: 'Active body balance',
      image: '/images/categories/vitality-care.avif',
      tone: 'sage',
    },
  ],
  serviceBanner: {
    title: 'Delivery at your door step',
    subtitle: 'We are available for every time.',
    seal: '6 days delivery promise',
    ctaLabel: 'Order Now',
  },
  sections: [
    {
      id: 'top-sellers',
      title: 'Shop our top sellers',
      accent: 'blue',
      products: [
        allProducts[0],
        allProducts[4],
        allProducts[7],
        allProducts[8],
        allProducts[6],
      ],
    },
    {
      id: 'deals',
      title: 'Deals of the day',
      accent: 'green',
      countdown: ['00', '00', '00', '00'],
      products: [
        allProducts[1],
        allProducts[3],
        allProducts[5],
        allProducts[2],
        allProducts[0],
      ],
    },
    {
      id: 'recommended',
      title: 'Recommended for you',
      accent: 'blue',
      products: [
        allProducts[7],
        allProducts[6],
        allProducts[3],
        allProducts[4],
        allProducts[8],
      ],
    },
  ],
  shop: {
    banner: {
      eyebrow: 'buy more, save more',
      title: 'Shop Herbal Care',
      description:
        'Explore every capsule and powder from ST Herbal India in one linked shop page with real product images.',
      ctaLabel: 'Shop Now',
      image: '/images/shop-banner-reference.png',
    },
    products: shopProducts,
  },
  roots: {
    title: 'Our Roots',
    description:
      'ST Herbal India focuses on close-to-nature herbal formulas with a trust-first shopping experience, clear product benefits and easy navigation from homepage to shop.',
    ctaLabel: 'Know More',
    pillars: [
      {
        id: 'gmp',
        label: 'GMP, ISO & Non-GMO',
        icon: 'certified',
        image: '/images/pillars/certified-badge-v2.png',
      },
      {
        id: 'natural',
        label: 'Natural & Safe',
        icon: 'leaf',
        image: '/images/pillars/natural-safe.png',
      },
      {
        id: 'side-effects',
        label: 'No Side Effects',
        icon: 'ban',
        image: '/images/pillars/no-side-effects-v2.png',
      },
      {
        id: 'metals',
        label: 'Pure, No Heavy Metals',
        icon: 'shield',
        image: '/images/pillars/certified-badge-v2.png',
      },
    ],
  },
  about: {
    eyebrow: 'about us',
    heroTitle: 'Where Tradition Meets Modern Wellness.',
    promiseCards: aboutPromiseCards,
    story: {
      eyebrow: 'why us',
      title: 'We are committed to providing wholesome products that fit your lifestyle.',
      paragraphs: [
        'At ST Herbal India, we uphold the principles of Ayurveda by choosing trusted ingredients, thoughtful formulations, and customer-friendly wellness products that support everyday health naturally.',
        'Our goal is simple: make herbal care feel premium, approachable, and dependable for every home.',
      ],
      image: '/images/shop-banner-reference.png',
      imageAlt: 'Fresh herbal ingredients and wellness care',
      markImage: '/images/leaf-logo.png',
    },
    values: aboutValueItems,
    blog: {
      eyebrow: 'recent post',
      title: 'latest from our blog',
      posts: aboutBlogPosts,
    },
  },
  contact: {
    eyebrow: 'contact us',
    heroTitle: 'we are at your disposal 7 days a week!',
    mapUrl: 'https://www.google.com/maps?q=Dwarka,New+Delhi&z=12&output=embed',
    formTitle: 'leave us a message',
    formPlaceholder: 'Your Review',
    formCheckboxLabel: 'Save my name, email, and phone details for the next message.',
    formSubmitLabel: 'submit',
    successMessage: 'Thank you. Your message has been saved successfully.',
    infoTitle: 'contact',
    infoBlocks: [
      {
        id: 'location',
        icon: 'pin',
        title: 'Store Location',
        value: 'Dwarka, New Delhi',
      },
      {
        id: 'phone',
        icon: 'phone',
        title: 'Phone',
        value: '7878463670',
      },
      {
        id: 'support',
        icon: 'mail',
        title: 'Customer Support',
        value: 'support@stherbalindia.com',
        note: 'For product information, order status, and general support.',
      },
    ],
  },
  testimonials: {
    title: 'Real people, real stories',
    entries: stories,
  },
  trustBadges: [
    {
      id: 'free-delivery',
      title: 'Free Delivery',
      description: 'Free delivery for orders above Rs500',
      icon: 'delivery',
    },
    {
      id: 'pricing',
      title: 'Everyday Low Price',
      description: 'Collection at the lowest price',
      icon: 'wallet',
    },
    {
      id: 'returns',
      title: 'Satisfied or Refunded',
      description: 'Guaranteed product quality',
      icon: 'refresh',
    },
    {
      id: 'payments',
      title: 'Secure Payments',
      description: 'Safety payment technologies',
      icon: 'lock',
    },
  ],
  footer: {
    newsletterTitle: 'send me up-to-date information',
    newsletterPlaceholder: 'Email address',
    newsletterCta: 'Subscribe',
    customerLinks: ['My Account', 'Track My Order', 'Return Policy', 'Wishlist'],
    quickLinks: [
      'Privacy Policy',
      'Terms and Condition',
      'Shipping Policy',
      'Cancellation Policy',
      'Contact Us',
    ],
    addressLabel: 'store location',
    address: 'Dwarka, New Delhi',
    phoneLabel: 'customer support',
    phone: '7878463670',
    payments: [
      { id: 'visa', label: 'VISA' },
      { id: 'mastercard', label: 'Mastercard', image: '/images/payments/mastercard.png' },
      { id: 'rupay', label: 'RuPay', image: '/images/payments/rupay.png' },
      { id: 'paypal', label: 'PayPal', image: '/images/payments/paypal.png' },
    ],
    copyright: 'Copyright (c) 2025 stherbalindia. All rights reserved',
  },
}

export default homepageData
