import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import {
  BagIcon,
  BellIcon,
  BrandLogo,
  ChevronDownIcon,
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  GlowIcon,
  GridIcon,
  LeafIcon,
  LockIcon,
  LogoutIcon,
  MailIcon,
  MenuIcon,
  PackageIcon,
  PlusIcon,
  RefreshIcon,
  ReviewIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SparkIcon,
  TicketIcon,
  TruckIcon,
  UserIcon,
  WalletIcon,
} from './Illustrations.jsx'
import AdminOverview from './admin/AdminOverview.jsx'

const defaultCredentials = {
  identifier: 'admin@stherbal.com',
  password: 'admin123',
}

const adminDashboardHash = '#/admin/dashboard'
const authUsersStorageKey = 'st-herbal-users'
const ordersStorageKey = 'st-herbal-orders'
const usersUpdatedEventName = 'st-herbal-users-updated'
const ordersUpdatedEventName = 'st-herbal-orders-updated'

const adminMenuGroups = [
  {
    id: 'overview',
    label: 'Overview',
    icon: GridIcon,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        view: 'overview-dashboard',
        hash: '#/admin/dashboard',
        description: 'Store snapshot, KPIs, charts and quick actions.',
      },
      {
        id: 'today-sales',
        label: "Today's Sales",
        view: 'overview-today-sales',
        hash: '#/admin/overview/today-sales',
        description: 'Track today order count, revenue and performance.',
      },
      {
        id: 'recent-activity',
        label: 'Recent Activity',
        view: 'overview-recent-activity',
        hash: '#/admin/overview/recent-activity',
        description: 'Latest admin actions, events and customer activity.',
      },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: BagIcon,
    items: [
      {
        id: 'all-orders',
        label: 'All Orders',
        view: 'orders-all-orders',
        hash: '#/admin/orders/all-orders',
        description: 'View complete order history with status and payment info.',
      },
      {
        id: 'pending-orders',
        label: 'Pending Orders',
        view: 'orders-pending-orders',
        hash: '#/admin/orders/pending-orders',
        description: 'Orders waiting for confirmation or packing.',
      },
      {
        id: 'packed-orders',
        label: 'Packed Orders',
        view: 'orders-packed-orders',
        hash: '#/admin/orders/packed-orders',
        description: 'Orders packed and ready for dispatch.',
      },
      {
        id: 'shipped-orders',
        label: 'Shipped Orders',
        view: 'orders-shipped-orders',
        hash: '#/admin/orders/shipped-orders',
        description: 'Track orders already handed over to delivery.',
      },
      {
        id: 'delivered-orders',
        label: 'Delivered Orders',
        view: 'orders-delivered-orders',
        hash: '#/admin/orders/delivered-orders',
        description: 'Successfully completed deliveries.',
      },
      {
        id: 'cancelled-orders',
        label: 'Cancelled Orders',
        view: 'orders-cancelled-orders',
        hash: '#/admin/orders/cancelled-orders',
        description: 'Cancelled or dropped customer orders.',
      },
      {
        id: 'return-refund',
        label: 'Return / Refund',
        view: 'orders-return-refund',
        hash: '#/admin/orders/return-refund',
        description: 'Monitor returned packages and refund cases.',
      },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    icon: LeafIcon,
    items: [
      {
        id: 'add-product',
        label: 'Add Product',
        view: 'products-add-product',
        hash: '#/admin/products/add-product',
        description: 'Add a new herbal product to the draft catalog.',
      },
      {
        id: 'all-products',
        label: 'All Products',
        view: 'products-all-products',
        hash: '#/admin/products/all-products',
        description: 'Manage banner text and the full product catalog JSON.',
      },
      {
        id: 'product-categories',
        label: 'Product Categories',
        view: 'products-product-categories',
        hash: '#/admin/products/product-categories',
        description: 'Edit homepage category cards and labels.',
      },
      {
        id: 'featured-products',
        label: 'Featured Products',
        view: 'products-featured-products',
        hash: '#/admin/products/featured-products',
        description: 'Control homepage featured product sections.',
      },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: PackageIcon,
    items: [
      {
        id: 'stock-management',
        label: 'Stock Management',
        view: 'inventory-stock-management',
        hash: '#/admin/inventory/stock-management',
        description: 'Full stock visibility across herbal inventory.',
      },
      {
        id: 'low-stock',
        label: 'Low Stock',
        view: 'inventory-low-stock',
        hash: '#/admin/inventory/low-stock',
        description: 'Products that need restocking soon.',
      },
      {
        id: 'out-of-stock',
        label: 'Out of Stock',
        view: 'inventory-out-of-stock',
        hash: '#/admin/inventory/out-of-stock',
        description: 'Products currently unavailable in the catalog.',
      },
      {
        id: 'expiring-soon',
        label: 'Expiring Soon',
        view: 'inventory-expiring-soon',
        hash: '#/admin/inventory/expiring-soon',
        description: 'Products near expiry for quick action.',
      },
      {
        id: 'expired-products',
        label: 'Expired Products',
        view: 'inventory-expired-products',
        hash: '#/admin/inventory/expired-products',
        description: 'Expired items flagged for removal.',
      },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: UserIcon,
    items: [
      {
        id: 'all-customers',
        label: 'All Customers',
        view: 'customers-all-customers',
        hash: '#/admin/customers/all-customers',
        description: 'Customer directory with spend and activity data.',
      },
      {
        id: 'new-customers',
        label: 'New Customers',
        view: 'customers-new-customers',
        hash: '#/admin/customers/new-customers',
        description: 'Recently acquired customers from new campaigns.',
      },
      {
        id: 'blocked-customers',
        label: 'Blocked Customers',
        view: 'customers-blocked-customers',
        hash: '#/admin/customers/blocked-customers',
        description: 'Spam, flagged or verification-failed accounts.',
      },
    ],
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: WalletIcon,
    items: [
      {
        id: 'all-payments',
        label: 'All Payments',
        view: 'payments-all-payments',
        hash: '#/admin/payments/all-payments',
        description: 'Unified payment ledger for all orders.',
      },
      {
        id: 'paid-orders',
        label: 'Paid Orders',
        view: 'payments-paid-orders',
        hash: '#/admin/payments/paid-orders',
        description: 'Completed online transactions.',
      },
      {
        id: 'cod-orders',
        label: 'COD Orders',
        view: 'payments-cod-orders',
        hash: '#/admin/payments/cod-orders',
        description: 'Cash on delivery orders awaiting settlement.',
      },
      {
        id: 'failed-payments',
        label: 'Failed Payments',
        view: 'payments-failed-payments',
        hash: '#/admin/payments/failed-payments',
        description: 'Failed checkout and payment retry cases.',
      },
      {
        id: 'refunds',
        label: 'Refunds',
        view: 'payments-refunds',
        hash: '#/admin/payments/refunds',
        description: 'Refunded and reversed payment entries.',
      },
    ],
  },
  {
    id: 'coupons',
    label: 'Coupons & Offers',
    icon: TicketIcon,
    items: [
      {
        id: 'add-coupon',
        label: 'Add Coupon',
        view: 'coupons-add-coupon',
        hash: '#/admin/coupons/add-coupon',
        description: 'Create a new offer or discount code draft.',
      },
      {
        id: 'all-coupons',
        label: 'All Coupons',
        view: 'coupons-all-coupons',
        hash: '#/admin/coupons/all-coupons',
        description: 'Review every coupon and promotion code.',
      },
      {
        id: 'active-offers',
        label: 'Active Offers',
        view: 'coupons-active-offers',
        hash: '#/admin/coupons/active-offers',
        description: 'Currently running offers and active promotions.',
      },
      {
        id: 'expired-offers',
        label: 'Expired Offers',
        view: 'coupons-expired-offers',
        hash: '#/admin/coupons/expired-offers',
        description: 'Expired campaigns kept for reference.',
      },
    ],
  },
  {
    id: 'banners',
    label: 'Banners',
    icon: GlowIcon,
    items: [
      {
        id: 'home-banner',
        label: 'Home Banner',
        view: 'banners-home-banner',
        hash: '#/admin/banners/home-banner',
        description: 'Edit homepage hero slider and banner copy.',
      },
      {
        id: 'offer-banner',
        label: 'Offer Banner',
        view: 'banners-offer-banner',
        hash: '#/admin/banners/offer-banner',
        description: 'Manage offer strips, promo notes and delivery banner.',
      },
      {
        id: 'add-banner',
        label: 'Add Banner',
        view: 'banners-add-banner',
        hash: '#/admin/banners/add-banner',
        description: 'Create a new hero slide draft.',
      },
      {
        id: 'all-banners',
        label: 'All Banners',
        view: 'banners-all-banners',
        hash: '#/admin/banners/all-banners',
        description: 'Review every configured banner in one place.',
      },
    ],
  },
  {
    id: 'reviews',
    label: 'Reviews',
    icon: ReviewIcon,
    items: [
      {
        id: 'all-reviews',
        label: 'All Reviews',
        view: 'reviews-all-reviews',
        hash: '#/admin/reviews/all-reviews',
        description: 'Customer testimonials and product feedback queue.',
      },
      {
        id: 'pending-reviews',
        label: 'Pending Reviews',
        view: 'reviews-pending-reviews',
        hash: '#/admin/reviews/pending-reviews',
        description: 'Reviews waiting for admin moderation.',
      },
      {
        id: 'approved-reviews',
        label: 'Approved Reviews',
        view: 'reviews-approved-reviews',
        hash: '#/admin/reviews/approved-reviews',
        description: 'Approved reviews visible in the storefront.',
      },
      {
        id: 'rejected-reviews',
        label: 'Rejected Reviews',
        view: 'reviews-rejected-reviews',
        hash: '#/admin/reviews/rejected-reviews',
        description: 'Rejected reviews stored for review history.',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    items: [
      {
        id: 'store-details',
        label: 'Store Details',
        view: 'settings-store-details',
        hash: '#/admin/settings/store-details',
        description: 'Edit store content, contact info, about data and raw JSON.',
      },
      {
        id: 'admin-profile',
        label: 'Admin Profile',
        view: 'settings-admin-profile',
        hash: '#/admin/settings/admin-profile',
        description: 'View the current admin account and session details.',
      },
      {
        id: 'payment-settings',
        label: 'Payment Settings',
        view: 'settings-payment-settings',
        hash: '#/admin/settings/payment-settings',
        description: 'Manage payment labels and checkout trust content.',
      },
      {
        id: 'delivery-settings',
        label: 'Delivery Settings',
        view: 'settings-delivery-settings',
        hash: '#/admin/settings/delivery-settings',
        description: 'Update delivery banner copy and support details.',
      },
      {
        id: 'change-password',
        label: 'Change Password',
        view: 'settings-change-password',
        hash: '#/admin/settings/change-password',
        description: 'Password tools placeholder for upcoming backend support.',
      },
    ],
  },
]

const adminMenuItems = adminMenuGroups.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    groupId: group.id,
    groupLabel: group.label,
  })),
)

const adminViewMap = new Map(adminMenuItems.map((item) => [item.view, item]))

const legacySectionViewMap = {
  overview: 'overview-dashboard',
  general: 'settings-store-details',
  hero: 'banners-home-banner',
  categories: 'products-product-categories',
  shop: 'products-all-products',
  about: 'settings-store-details',
  contact: 'settings-store-details',
  advanced: 'settings-store-details',
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value))
}

function prettyJson(value) {
  return JSON.stringify(value, null, 2)
}

function readStoredJson(key, fallbackValue) {
  try {
    const rawValue = window.localStorage.getItem(key)
    const parsedValue = JSON.parse(rawValue ?? 'null')
    return parsedValue ?? fallbackValue
  } catch {
    return fallbackValue
  }
}

function persistStoredJson(key, value, eventName) {
  window.localStorage.setItem(key, JSON.stringify(value))

  if (eventName) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: value }))
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Selected file could not be converted into an image preview.'))
    }

    reader.onerror = () => reject(new Error('Unable to read the selected image file.'))
    reader.readAsDataURL(file)
  })
}

function AdminInput({
  icon: Icon,
  label,
  name,
  onChange,
  placeholder,
  type = 'text',
  value,
  error,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const isPasswordField = type === 'password'

  return (
    <label className="admin-field">
      <span className="admin-field__label">{label}</span>
      <div className={`admin-field__control ${error ? 'is-error' : ''}`}>
        {Icon ? (
          <span className="admin-field__icon">
            <Icon />
          </span>
        ) : null}
        <input
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={isPasswordField && isVisible ? 'text' : type}
          value={value}
        />
        {isPasswordField ? (
          <button
            className="admin-field__toggle"
            onClick={() => setIsVisible((currentValue) => !currentValue)}
            type="button"
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : null}
      </div>
      {error ? <span className="admin-field__error">{error}</span> : null}
    </label>
  )
}

function AdminTextarea({ label, hint, onChange, rows = 8, value }) {
  return (
    <label className="admin-field">
      <span className="admin-field__label">{label}</span>
      <textarea className="admin-field__textarea" onChange={onChange} rows={rows} value={value} />
      {hint ? <span className="admin-field__hint">{hint}</span> : null}
    </label>
  )
}

function AdminImageInput({ hint, label, onChange, previewAlt, previewSrc }) {
  return (
    <div className="admin-field">
      <span className="admin-field__label">{label}</span>

      <label className="admin-file-picker">
        <input accept="image/*" className="admin-file-picker__input" onChange={onChange} type="file" />
        <span className="admin-file-picker__button">Choose image file</span>
        <span className="admin-file-picker__meta">
          {previewSrc ? 'Current banner image selected' : 'No banner image selected'}
        </span>
      </label>

      {previewSrc ? (
        <div className="admin-file-preview">
          <img alt={previewAlt} src={previewSrc} />
        </div>
      ) : null}

      {hint ? <span className="admin-field__hint">{hint}</span> : null}
    </div>
  )
}

function AdminSectionCard({ title, subtitle, children, actions }) {
  return (
    <section className="admin-card surface-card">
      <div className="admin-card__header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div className="admin-card__actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}

function updateArrayItem(items, index, field, value) {
  return items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
}

function slugifyValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function splitLines(value) {
  return String(value || '')
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function formatMoney(value) {
  return `Rs ${new Intl.NumberFormat('en-IN').format(Number(value) || 0)}`
}

function formatDateLabel(value) {
  if (!value) {
    return 'Today'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function isSameCalendarDate(dateValue, comparisonDate) {
  const nextDate = new Date(dateValue)

  if (Number.isNaN(nextDate.getTime())) {
    return false
  }

  return (
    nextDate.getFullYear() === comparisonDate.getFullYear() &&
    nextDate.getMonth() === comparisonDate.getMonth() &&
    nextDate.getDate() === comparisonDate.getDate()
  )
}

function getAdminViewFromHash() {
  if (typeof window === 'undefined') {
    return 'overview-dashboard'
  }

  const normalizedHash = window.location.hash || adminDashboardHash
  return adminMenuItems.find((item) => item.hash === normalizedHash)?.view ?? 'overview-dashboard'
}

function createOpenGroupState(activeView = 'overview-dashboard') {
  const activeGroupId = adminViewMap.get(activeView)?.groupId ?? adminMenuGroups[0].id

  return Object.fromEntries(
    adminMenuGroups.map((group) => [group.id, group.id === activeGroupId]),
  )
}

function createProductForm() {
  return {
    id: '',
    name: '',
    category: 'Herbal Care',
    price: '499',
    originalPrice: '699',
    image: '/images/products/giloy-capsules.png',
    summary: 'Premium Ayurvedic wellness support for daily care.',
  }
}

function createCouponForm() {
  return {
    code: '',
    discount: '10',
    description: 'Seasonal herbal wellness offer',
    expiresOn: '2026-08-31',
    status: 'Active',
  }
}

function createDefaultCoupons() {
  return [
    {
      id: 'coupon-1',
      code: 'HERBAL10',
      discount: '10%',
      description: 'First order welcome offer',
      expiresOn: '31 Aug 2026',
      status: 'Active',
    },
    {
      id: 'coupon-2',
      code: 'IMMUNITY15',
      discount: '15%',
      description: 'Immunity range campaign',
      expiresOn: '26 Jul 2026',
      status: 'Active',
    },
    {
      id: 'coupon-3',
      code: 'MONSOON20',
      discount: '20%',
      description: 'Monsoon health bundle',
      expiresOn: '02 Jul 2026',
      status: 'Expired',
    },
  ]
}

function matchesSearch(value, query) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return true
  }

  return JSON.stringify(value).toLowerCase().includes(normalizedQuery)
}

function buildAdminWorkspaceData(draft, users = [], orderRecords = []) {
  const catalog =
    Array.isArray(draft?.shop?.products) && draft.shop.products.length > 0
      ? draft.shop.products
      : [
          {
            id: 'giloy-capsules',
            name: 'Giloy Capsules',
            category: 'Immunity Care',
            price: 449,
            originalPrice: 649,
            image: '/images/products/giloy-capsules.png',
            reviewCount: 29,
            createdAt: '2026-07-08',
          },
        ]

  const pickProduct = (index) => catalog[index % catalog.length]

  const orders = (Array.isArray(orderRecords) ? orderRecords : [])
    .map((order, index) => {
      const items = Array.isArray(order?.items) ? order.items.filter(Boolean) : []
      const totalQuantity =
        items.reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0) ||
        Math.max(1, Number(order?.quantity) || 1)
      const productNames = items.map((item) => item.name).filter(Boolean)
      const product =
        productNames.length > 1
          ? `${productNames[0]} +${productNames.length - 1} more`
          : productNames[0] ?? order?.product ?? pickProduct(index).name
      const totalValue =
        Number(order?.total) ||
        items.reduce(
          (sum, item) => sum + (Number(item.price) || 0) * Math.max(1, Number(item.quantity) || 1),
          0,
        )
      const orderCustomer =
        typeof order?.customer === 'object' && order.customer
          ? order.customer
          : { firstName: String(order?.customer || '').trim() }
      const customerName =
        [orderCustomer.firstName, orderCustomer.lastName].filter(Boolean).join(' ') ||
        orderCustomer.name ||
        orderCustomer.email ||
        orderCustomer.phone ||
        `Customer ${index + 1}`

      return {
        id: String(order?.id || `ST-${Date.now()}-${index}`),
        customer: customerName,
        customerKey: String(
          orderCustomer.email || orderCustomer.phone || customerName || `guest-${index}`,
        ).toLowerCase(),
        email: orderCustomer.email || '',
        phone: orderCustomer.phone || '',
        product,
        quantity: totalQuantity,
        total: formatMoney(totalValue),
        totalValue,
        paymentStatus: order?.paymentStatus || (order?.paymentMethod === 'cod' ? 'COD' : 'Paid'),
        paymentMethod:
          order?.paymentMethod === 'cod'
            ? 'Cash on Delivery'
            : order?.paymentMethod === 'phonepe'
              ? 'PhonePe'
              : order?.method || 'Online',
        orderStatus: order?.orderStatus || 'Pending',
        date: order?.date || formatDateLabel(order?.createdAt),
        createdAt: order?.createdAt || '',
      }
    })
    .sort((leftValue, rightValue) => {
      const leftTime = new Date(leftValue.createdAt || 0).getTime()
      const rightTime = new Date(rightValue.createdAt || 0).getTime()
      return rightTime - leftTime
    })

  const customerMap = new Map()

  ;(Array.isArray(users) ? users : []).forEach((user, index) => {
    const customerKey = String(user?.email || user?.mobile || user?.id || `user-${index}`).toLowerCase()

    customerMap.set(customerKey, {
      id: user?.id || `CUS-${index + 1}`,
      customerKey,
      name: user?.fullName || user?.email || `Customer ${index + 1}`,
      email: user?.email || '',
      phone: user?.mobile || '',
      joined: formatDateLabel(user?.createdAt),
      joinedAt: user?.createdAt || '',
      orders: 0,
      spendValue: 0,
      spend: formatMoney(0),
      segment: 'New',
      status: user?.status || 'Active',
      source: 'registered',
    })
  })

  orders.forEach((order, index) => {
    const customerKey = String(order.customerKey || order.email || order.phone || `guest-${index}`).toLowerCase()
    const existingCustomer =
      customerMap.get(customerKey) ??
      {
        id: `CUS-GUEST-${index + 1}`,
        customerKey,
        name: order.customer,
        email: order.email || '',
        phone: order.phone || '',
        joined: order.date,
        joinedAt: order.createdAt || '',
        orders: 0,
        spendValue: 0,
        spend: formatMoney(0),
        segment: 'New',
        status: 'New',
        source: 'guest',
      }

    existingCustomer.orders += 1
    existingCustomer.spendValue += Number(order.totalValue) || 0
    customerMap.set(customerKey, existingCustomer)
  })

  const customers = [...customerMap.values()]
    .map((customer) => {
      const isBlocked = String(customer.status || '').toLowerCase() === 'blocked'
      const segment = isBlocked ? 'Attention' : customer.orders > 1 ? 'Repeat' : 'New'
      const status =
        customer.status ||
        (customer.orders > 0 && customer.source === 'guest' ? 'New' : 'Active')

      return {
        ...customer,
        spend: formatMoney(customer.spendValue),
        segment,
        status,
      }
    })
    .sort((leftValue, rightValue) => rightValue.spendValue - leftValue.spendValue)

  const stockLevels = [42, 8, 0, 5, 26, 3, 0, 14, 31, 7]
  const expiryDates = [
    '29 Aug 2026',
    '18 Jul 2026',
    '02 Sep 2026',
    '15 Jul 2026',
    '22 Oct 2026',
    '13 Jul 2026',
    '02 Jul 2026',
    '26 Aug 2026',
    '09 Nov 2026',
    '19 Jul 2026',
  ]

  const inventory = catalog.slice(0, 10).map((product, index) => {
    const stock = stockLevels[index % stockLevels.length]
    const expiryDate = expiryDates[index % expiryDates.length]
    let status = 'Healthy'

    if (stock === 0) {
      status = 'Out of Stock'
    } else if (stock <= 5) {
      status = 'Low Stock'
    }

    if (
      expiryDate === '13 Jul 2026' ||
      expiryDate === '15 Jul 2026' ||
      expiryDate === '18 Jul 2026' ||
      expiryDate === '19 Jul 2026'
    ) {
      status = status === 'Out of Stock' ? status : 'Expiring Soon'
    }

    if (expiryDate === '02 Jul 2026') {
      status = 'Expired'
    }

    return {
      id: product.id,
      product: product.name,
      category: product.category,
      stock,
      expiryDate,
      status,
      sku: `SKU-${String(index + 1).padStart(3, '0')}`,
    }
  })

  const payments = orders.map((order, index) => ({
    id: `PAY-${String(index + 1).padStart(4, '0')}`,
    orderId: order.id,
    customer: order.customer,
    amount: order.total,
    method: order.paymentMethod,
    status: order.paymentStatus,
    date: order.date,
  }))

  const reviewDates = [
    '07 Jul 2026',
    '08 Jul 2026',
    '09 Jul 2026',
    '10 Jul 2026',
    '11 Jul 2026',
  ]

  const reviews = (
    Array.isArray(draft?.testimonials?.entries) ? draft.testimonials.entries : []
  ).map((entry, index) => ({
    id: entry.id ?? `review-${index + 1}`,
    customer: entry.author ?? `Customer ${index + 1}`,
    rating: entry.stars ?? 5,
    comment: entry.quote ?? 'Great herbal wellness range.',
    status: entry.status ?? 'Approved',
    product: entry.product ?? pickProduct(index).name,
    date: entry.date ?? reviewDates[index % reviewDates.length],
  }))

  const activity = [
    orders[0]
      ? {
          id: 'activity-order',
          title: 'Latest order captured',
          detail: `${orders[0].customer} placed ${orders[0].product}.`,
          time: orders[0].date,
        }
      : null,
    {
      id: 'activity-banner',
      title: 'Homepage content synced',
      detail: `${catalog.length} products and ${reviews.length} reviews are ready for storefront sync.`,
      time: 'Just now',
    },
    inventory.find((item) => item.status === 'Low Stock' || item.status === 'Out of Stock')
      ? {
          id: 'activity-stock',
          title: 'Stock alert',
          detail: `${inventory.find((item) => item.status === 'Low Stock' || item.status === 'Out of Stock')?.product} needs inventory review.`,
          time: 'Auto updated',
        }
      : null,
    customers.find((item) => item.status === 'Blocked')
      ? {
          id: 'activity-customer',
          title: 'Blocked customer tracked',
          detail: `${customers.find((item) => item.status === 'Blocked')?.name} has restricted access.`,
          time: 'Admin managed',
        }
      : null,
  ].filter(Boolean)

  const todayReference = new Date()
  const todayOrders = orders.filter((order) => isSameCalendarDate(order.createdAt, todayReference))
  const todayRevenue = todayOrders.reduce((sum, order) => sum + (Number(order.totalValue) || 0), 0)

  return {
    orders,
    customers,
    inventory,
    payments,
    reviews,
    activity,
    todayOrders,
    todaySales: {
      revenue: formatMoney(todayRevenue),
      orderCount: todayOrders.length,
      averageOrderValue: formatMoney(
        todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length) : 0,
      ),
      conversion: customers.length > 0 ? `${((todayOrders.length / customers.length) * 100).toFixed(1)}%` : '0%',
    },
  }
}

function AdminMetricTile({ icon: Icon, label, note, tone = 'mint', value }) {
  return (
    <article className={`admin-shell-metric admin-shell-metric--${tone}`}>
      <span className="admin-shell-metric__icon">{Icon ? <Icon /> : null}</span>
      <strong>{value}</strong>
      <span>{label}</span>
      {note ? <p>{note}</p> : null}
    </article>
  )
}

function AdminDataTable({ actions, columns, emptyMessage, rows, subtitle, title }) {
  return (
    <section className="admin-table-card">
      <div className="admin-section-heading">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div className="admin-card__actions">{actions}</div> : null}
      </div>

      {rows.length === 0 ? (
        <div className="admin-empty-state">
          <strong>No records found</strong>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={`${row.id}-${column.key}`}>
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function AdminActivityFeed({ items, title, subtitle }) {
  return (
    <section className="admin-panel-card">
      <div className="admin-section-heading">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>

      <div className="admin-activity-list">
        {items.map((item) => (
          <article className="admin-activity-item" key={item.id}>
            <span className="admin-activity-item__dot" />
            <div>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </div>
            <span>{item.time}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

function MenuItem({
  activeView,
  group,
  isCollapsed,
  isOpen,
  onNavigate,
  onOpenCollapsedGroup,
  onToggleGroup,
}) {
  const isActive = group.items.some((item) => item.view === activeView)
  const Icon = group.icon
  const handleGroupClick = () => {
    if (isCollapsed) {
      onOpenCollapsedGroup(group.id)
      return
    }

    onToggleGroup(group.id)
  }

  return (
    <div className={`admin-menu-group ${isActive ? 'is-active' : ''} ${isOpen ? 'is-open' : ''}`}>
      <button
        aria-expanded={!isCollapsed ? isOpen : undefined}
        className="admin-menu-group__trigger"
        onClick={handleGroupClick}
        type="button"
      >
        <span className="admin-menu-group__entry">
          <span className="admin-menu-group__icon">
            <Icon />
          </span>

          {!isCollapsed ? (
            <span className="admin-menu-group__copy">
              <span className="admin-menu-group__label">{group.label}</span>
            </span>
          ) : null}
        </span>

        {!isCollapsed ? (
          <span className="admin-menu-group__caret">
            <ChevronDownIcon />
          </span>
        ) : null}
      </button>

      {!isCollapsed ? (
        <div className="admin-menu-group__submenu">
          <div className="admin-menu-group__submenu-inner">
            {group.items.map((item) => (
              <button
                className={`admin-menu-group__submenu-item ${item.view === activeView ? 'is-active' : ''}`}
                key={item.view}
                onClick={() => onNavigate(item.view, item.label)}
                type="button"
              >
                <span className="admin-menu-group__submenu-dot" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function AdminSidebar({
  activeView,
  adminSession,
  expandedGroups,
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
  onOpenCollapsedGroup,
  onLogout,
  onNavigate,
  onToggleCollapse,
  onToggleGroup,
}) {
  return (
    <aside
      className={`admin-sidebar admin-shell__sidebar ${isCollapsed ? 'is-collapsed' : ''} ${
        isMobileOpen ? 'is-mobile-open' : ''
      }`}
    >
      <div className="admin-shell__sidebar-head">
        <div className="admin-shell__brand">
          <a href="#/">
            <BrandLogo />
          </a>
        </div>

        <div className="admin-shell__sidebar-controls">
          <button
            className="admin-shell__icon-button admin-shell__icon-button--desktop"
            onClick={onToggleCollapse}
            type="button"
          >
            <MenuIcon />
          </button>
          <button
            className="admin-shell__icon-button admin-shell__icon-button--mobile"
            onClick={onCloseMobile}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <nav className="admin-sidebar__nav admin-shell__nav">
        {adminMenuGroups.map((group) => (
          <MenuItem
            activeView={activeView}
            group={group}
            isCollapsed={isCollapsed}
            isOpen={expandedGroups[group.id]}
            key={group.id}
            onNavigate={onNavigate}
            onOpenCollapsedGroup={onOpenCollapsedGroup}
            onToggleGroup={onToggleGroup}
          />
        ))}
      </nav>

      <div className="admin-shell__sidebar-footer">
        <button className="admin-shell__logout" onClick={onLogout} type="button">
          <span className="admin-menu-group__icon">
            <LogoutIcon />
          </span>
          {!isCollapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </aside>
  )
}

function AdminTopbar({
  activeItem,
  adminSession,
  notificationCount,
  onLogout,
  onOpenMobile,
  onSearchChange,
  searchValue,
}) {
  return (
    <header className="admin-topbar admin-topbar--shell surface-card">
      <div className="admin-topbar__intro">
        <div className="admin-topbar__title-row">
          <button
            className="admin-shell__icon-button admin-shell__icon-button--mobile-only"
            onClick={onOpenMobile}
            type="button"
          >
            <MenuIcon />
          </button>
          <span className="admin-topbar__eyebrow">ST Herbal Control Room</span>
        </div>
        <h1>{activeItem?.groupLabel ?? 'Admin Dashboard'}</h1>
        <p>{activeItem?.description ?? 'Manage orders, products, customers and storefront content.'}</p>
        <span className="admin-topbar__section-chip">{activeItem?.label ?? 'Dashboard'}</span>
      </div>

      <div className="admin-topbar__tools">
        <label className="admin-topbar__search">
          <span>
            <SearchIcon />
          </span>
          <input
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products, orders, customers..."
            type="search"
            value={searchValue}
          />
        </label>

        <button className="admin-topbar__bell" type="button">
          <BellIcon />
          <span className="admin-topbar__bell-badge">{notificationCount}</span>
        </button>

        <div className="admin-topbar__profile">
          <span className="admin-topbar__profile-avatar">
            <UserIcon />
          </span>
          <div>
            <strong>{adminSession?.displayName ?? 'ST Herbal Admin'}</strong>
            <span>Administrator</span>
          </div>
        </div>

        <button
          className="admin-button admin-button--outline admin-topbar__logout"
          onClick={onLogout}
          type="button"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

function AdminLayout({
  children,
  isMobileOpen,
  isSidebarCollapsed,
  onOverlayClick,
  sidebar,
  topbar,
  toolbar,
}) {
  return (
    <section
      className={`admin-dashboard admin-shell ${isMobileOpen ? 'is-sidebar-open' : ''} ${
        isSidebarCollapsed ? 'is-sidebar-collapsed' : ''
      }`}
    >
      {sidebar}
      {isMobileOpen ? (
        <button className="admin-shell__overlay" onClick={onOverlayClick} type="button" />
      ) : null}

      <div className="admin-main admin-main--shell">
        {topbar}
        {toolbar}
        {children}
      </div>
    </section>
  )
}

function AdminPlaceholderPage({ actionLabel, onAction, subtitle, title }) {
  return (
    <section className="admin-panel-card">
      <div className="admin-section-heading">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        {onAction && actionLabel ? (
          <button className="admin-mini-button" onClick={onAction} type="button">
            {actionLabel}
          </button>
        ) : null}
      </div>

      <div className="admin-empty-state">
        <strong>Section ready</strong>
        <p>{subtitle}</p>
      </div>
    </section>
  )
}

function AdminLoginPage({ adminSession, onAdminLogin }) {
  const [formData, setFormData] = useState(defaultCredentials)
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentValue) => ({ ...currentValue, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    setFormMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}

    if (!formData.identifier.trim()) {
      nextErrors.identifier = 'Admin email is required.'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setFormMessage('')

    try {
      const result = await onAdminLogin(formData)

      if (!result.ok) {
        setFormMessage(result.error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="admin-login-page">
      <div className="admin-login-card surface-card">
        <div className="admin-login-card__brand">
          <a href="#/">
            <BrandLogo />
          </a>
          <span className="admin-login-badge">Admin Access</span>
        </div>

        <div className="admin-login-card__content">
          <div className="admin-login-card__intro">
            <h1>ST Herbal India Admin Panel</h1>
            <p>
              Login karke aap homepage banners, categories, products, About page,
              Contact page aur full website content manage kar sakte ho.
            </p>
          </div>

          <div className="admin-login-hint">
            <strong>Default Login</strong>
            <span>Email: {defaultCredentials.identifier}</span>
            <span>Password: {defaultCredentials.password}</span>
          </div>

          {adminSession ? (
            <div className="admin-login-active">
              <p>You are already logged in as admin.</p>
              <a className="admin-button admin-button--primary" href={adminDashboardHash}>
                Open Dashboard
              </a>
            </div>
          ) : (
            <form className="admin-login-form" onSubmit={handleSubmit}>
              <AdminInput
                error={errors.identifier}
                icon={MailIcon}
                label="Admin Email"
                name="identifier"
                onChange={handleChange}
                placeholder="Enter admin email"
                type="email"
                value={formData.identifier}
              />

              <AdminInput
                error={errors.password}
                icon={LockIcon}
                label="Password"
                name="password"
                onChange={handleChange}
                placeholder="Enter password"
                type="password"
                value={formData.password}
              />

              {formMessage ? <div className="admin-form-message is-error">{formMessage}</div> : null}

              <button className="admin-button admin-button--primary" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Logging in...' : 'Login to Dashboard'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function AdminDashboardPage({
  adminSession,
  data,
  onAdminLogout,
  onAdminSessionExpired,
  onAdminSessionUpdated,
  onContentSaved,
}) {
  const [draft, setDraft] = useState(() => cloneData(data))
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isProfileSaving, setIsProfileSaving] = useState(false)
  const [isPasswordSaving, setIsPasswordSaving] = useState(false)
  const [activeView, setActiveView] = useState(() => getAdminViewFromHash())
  const [expandedGroups, setExpandedGroups] = useState(() =>
    createOpenGroupState(getAdminViewFromHash()),
  )
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [productsJson, setProductsJson] = useState(() => prettyJson(data?.shop?.products ?? []))
  const [productsJsonDirty, setProductsJsonDirty] = useState(false)
  const [fullJson, setFullJson] = useState(() => prettyJson(data))
  const [fullJsonDirty, setFullJsonDirty] = useState(false)
  const [newProductForm, setNewProductForm] = useState(() => createProductForm())
  const [couponForm, setCouponForm] = useState(() => createCouponForm())
  const [userAccounts, setUserAccounts] = useState(() => readStoredJson(authUsersStorageKey, []))
  const [orderRecords, setOrderRecords] = useState(() => readStoredJson(ordersStorageKey, []))
  const [profileForm, setProfileForm] = useState(() => ({
    displayName: adminSession?.displayName ?? 'ST Herbal Admin',
    identifier: adminSession?.identifier ?? 'admin@stherbal.com',
  }))
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    nextPassword: '',
    confirmPassword: '',
  })
  const notifySessionExpired = useEffectEvent(() => {
    onAdminSessionExpired?.()
  })
  const notifyContentLoaded = useEffectEvent((content) => {
    onContentSaved?.(content, { silent: true })
  })

  useEffect(() => {
    if (window.location.hash === '#/admin' || window.location.hash === '#/admin/') {
      window.location.hash = adminDashboardHash
    }
  }, [])

  useEffect(() => {
    function handleHashChange() {
      const nextView = getAdminViewFromHash()
      setActiveView(nextView)
      setExpandedGroups(createOpenGroupState(nextView))
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (!productsJsonDirty) {
      setProductsJson(prettyJson(draft?.shop?.products ?? []))
    }
  }, [draft, productsJsonDirty])

  useEffect(() => {
    if (!fullJsonDirty) {
      setFullJson(prettyJson(draft))
    }
  }, [draft, fullJsonDirty])

  useEffect(() => {
    setProfileForm({
      displayName: adminSession?.displayName ?? 'ST Herbal Admin',
      identifier: adminSession?.identifier ?? 'admin@stherbal.com',
    })
  }, [adminSession?.displayName, adminSession?.identifier])

  useEffect(() => {
    let isCancelled = false

    async function loadProtectedContent() {
      if (!adminSession?.token) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await fetch('/api/admin/content', {
          headers: {
            Authorization: `Bearer ${adminSession.token}`,
          },
        })

        if (response.status === 401) {
          notifySessionExpired()
          return
        }

        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload.error || 'Unable to load admin content.')
        }

        if (isCancelled) {
          return
        }

        const nextDraft = cloneData(payload.content)
        setDraft(nextDraft)
        setProductsJson(prettyJson(nextDraft?.shop?.products ?? []))
        setProductsJsonDirty(false)
        setFullJson(prettyJson(nextDraft))
        setFullJsonDirty(false)
        notifyContentLoaded(payload.content)
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load admin data.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadProtectedContent()

    return () => {
      isCancelled = true
    }
  }, [adminSession?.token, notifyContentLoaded, notifySessionExpired])

  useEffect(() => {
    function syncRuntimeWorkspace(nextUsers, nextOrders) {
      setUserAccounts(nextUsers ?? readStoredJson(authUsersStorageKey, []))
      setOrderRecords(nextOrders ?? readStoredJson(ordersStorageKey, []))
    }

    function handleStorage(event) {
      if (event.key && ![authUsersStorageKey, ordersStorageKey].includes(event.key)) {
        return
      }

      syncRuntimeWorkspace()
    }

    function handleUsersUpdated(event) {
      syncRuntimeWorkspace(event.detail, undefined)
    }

    function handleOrdersUpdated(event) {
      syncRuntimeWorkspace(undefined, event.detail)
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(usersUpdatedEventName, handleUsersUpdated)
    window.addEventListener(ordersUpdatedEventName, handleOrdersUpdated)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(usersUpdatedEventName, handleUsersUpdated)
      window.removeEventListener(ordersUpdatedEventName, handleOrdersUpdated)
    }
  }, [])

  function updateDraft(transform) {
    setDraft((currentValue) => {
      const nextDraft = cloneData(currentValue)
      transform(nextDraft)
      return nextDraft
    })
    setStatusMessage('')
    setErrorMessage('')
  }

  function replaceDraft(nextDraft) {
    setDraft(cloneData(nextDraft))
    setStatusMessage('')
    setErrorMessage('')
  }

  function replaceUserAccounts(nextUsers, successMessage) {
    setUserAccounts(nextUsers)
    persistStoredJson(authUsersStorageKey, nextUsers, usersUpdatedEventName)

    if (successMessage) {
      setStatusMessage(successMessage)
      setErrorMessage('')
    }
  }

  function replaceOrderRecords(nextOrders, successMessage) {
    setOrderRecords(nextOrders)
    persistStoredJson(ordersStorageKey, nextOrders, ordersUpdatedEventName)

    if (successMessage) {
      setStatusMessage(successMessage)
      setErrorMessage('')
    }
  }

  function applyProductsJson() {
    try {
      const parsedProducts = JSON.parse(productsJson)

      if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
        throw new Error('Products JSON must be a non-empty array.')
      }

      updateDraft((nextDraft) => {
        nextDraft.shop.products = parsedProducts
      })
      setProductsJsonDirty(false)
      setStatusMessage('Product catalog draft updated.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Products JSON is invalid.')
    }
  }

  function applyFullJson() {
    try {
      const parsedContent = JSON.parse(fullJson)
      replaceDraft(parsedContent)
      setFullJsonDirty(false)
      setProductsJsonDirty(false)
      setStatusMessage('Full JSON draft applied successfully.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Full JSON is invalid.')
    }
  }

  async function handleSave() {
    setIsSaving(true)
    setStatusMessage('')
    setErrorMessage('')

    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSession.token}`,
        },
        body: JSON.stringify(draft),
      })

      if (response.status === 401) {
        onAdminSessionExpired?.()
        return
      }

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to save content.')
      }

      replaceDraft(payload.content)
      setProductsJson(prettyJson(payload.content?.shop?.products ?? []))
      setProductsJsonDirty(false)
      setFullJson(prettyJson(payload.content))
      setFullJsonDirty(false)
      setStatusMessage(payload.message || 'Website content updated successfully.')
      onContentSaved?.(payload.content)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save website content.')
    } finally {
      setIsSaving(false)
    }
  }

  function resetToCurrentContent() {
    replaceDraft(data)
    setProductsJson(prettyJson(data?.shop?.products ?? []))
    setProductsJsonDirty(false)
    setFullJson(prettyJson(data))
    setFullJsonDirty(false)
    setStatusMessage('Draft reset to current live website content.')
  }

  function updateProductField(productId, field, value) {
    updateDraft((nextDraft) => {
      nextDraft.shop.products = (nextDraft.shop.products ?? []).map((product) =>
        product.id === productId ? { ...product, [field]: value } : product,
      )
    })
  }

  function removeProduct(productId) {
    const productName = productCatalog.find((product) => product.id === productId)?.name ?? 'Product'

    updateDraft((nextDraft) => {
      nextDraft.shop.products = (nextDraft.shop.products ?? []).filter((product) => product.id !== productId)
      nextDraft.sections = (nextDraft.sections ?? []).map((section) => ({
        ...section,
        products: (section.products ?? []).filter((product) => product.id !== productId),
      }))
    })

    setStatusMessage(`${productName} removed from the catalog draft.`)
    setErrorMessage('')
  }

  function updateOrderField(orderId, field, value) {
    const nextOrders = orderRecords.map((order) =>
      order.id === orderId ? { ...order, [field]: value, updatedAt: new Date().toISOString() } : order,
    )

    replaceOrderRecords(nextOrders, `${field === 'orderStatus' ? 'Order' : 'Payment'} status updated.`)
  }

  function removeOrder(orderId) {
    replaceOrderRecords(
      orderRecords.filter((order) => order.id !== orderId),
      `Order ${orderId} removed from admin records.`,
    )
  }

  function updateCustomerStatus(customerId, nextStatus) {
    const nextUsers = userAccounts.map((user) =>
      user.id === customerId ? { ...user, status: nextStatus } : user,
    )

    replaceUserAccounts(nextUsers, `Customer status changed to ${nextStatus}.`)
  }

  function removeCustomer(customerId) {
    const targetUser = userAccounts.find((user) => user.id === customerId)
    const nextUsers = userAccounts.filter((user) => user.id !== customerId)

    replaceUserAccounts(nextUsers, 'Customer removed from storefront accounts.')

    if (targetUser?.email || targetUser?.mobile) {
      const customerEmail = String(targetUser.email || '').toLowerCase()
      const customerPhone = String(targetUser.mobile || '')
      const nextOrders = orderRecords.filter((order) => {
        const orderEmail = String(order?.customer?.email || '').toLowerCase()
        const orderPhone = String(order?.customer?.phone || '')

        return orderEmail !== customerEmail && orderPhone !== customerPhone
      })

      replaceOrderRecords(nextOrders)
    }
  }

  function removeGuestCustomer(customerKey, customerName) {
    replaceOrderRecords(
      orderRecords.filter((order) => {
        const orderCustomerKey = String(
          order?.customer?.email || order?.customer?.phone || order?.customer || '',
        ).toLowerCase()

        return orderCustomerKey !== String(customerKey || '').toLowerCase()
      }),
      `${customerName || 'Guest customer'} history removed from order records.`,
    )
  }

  function updateCouponField(index, field, value) {
    updateDraft((nextDraft) => {
      const nextCoupons = Array.isArray(nextDraft.coupons)
        ? nextDraft.coupons
        : createDefaultCoupons()

      nextDraft.coupons = updateArrayItem(nextCoupons, index, field, value)
    })
  }

  function removeCoupon(index) {
    updateDraft((nextDraft) => {
      const nextCoupons = Array.isArray(nextDraft.coupons)
        ? nextDraft.coupons
        : createDefaultCoupons()

      nextDraft.coupons = nextCoupons.filter((_, couponIndex) => couponIndex !== index)
    })

    setStatusMessage('Coupon removed from storefront offers.')
    setErrorMessage('')
  }

  function updateReviewStatus(reviewId, nextStatus) {
    updateDraft((nextDraft) => {
      nextDraft.testimonials.entries = (nextDraft.testimonials.entries ?? []).map((entry) =>
        entry.id === reviewId ? { ...entry, status: nextStatus } : entry,
      )
    })

    setStatusMessage(`Review marked as ${nextStatus}.`)
    setErrorMessage('')
  }

  function removeReview(reviewId) {
    updateDraft((nextDraft) => {
      nextDraft.testimonials.entries = (nextDraft.testimonials.entries ?? []).filter(
        (entry) => entry.id !== reviewId,
      )
    })

    setStatusMessage('Review removed from storefront stories.')
    setErrorMessage('')
  }

  function navigateToView(view, triggerLabel) {
    const nextItem = adminViewMap.get(view) ?? adminMenuItems[0]

    setActiveView(nextItem.view)
    setExpandedGroups(createOpenGroupState(nextItem.view))
    setIsSidebarOpen(false)
    setStatusMessage('')
    setErrorMessage('')

    if (window.location.hash !== nextItem.hash) {
      window.location.hash = nextItem.hash
    }
  }

  function navigateFromLegacySection(sectionId, triggerLabel) {
    navigateToView(legacySectionViewMap[sectionId] ?? 'overview-dashboard', triggerLabel)
  }

  function handleToggleGroup(groupId) {
    setExpandedGroups((currentValue) => {
      const nextOpenState = !currentValue[groupId]

      return Object.fromEntries(
        adminMenuGroups.map((group) => [group.id, group.id === groupId ? nextOpenState : false]),
      )
    })
  }

  function handleOpenCollapsedGroup(groupId) {
    setIsSidebarCollapsed(false)
    setExpandedGroups(
      Object.fromEntries(adminMenuGroups.map((group) => [group.id, group.id === groupId])),
    )
  }

  async function handleImageFileSelection(file, onApply, successMessage) {
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file for the banner.')
      return
    }

    try {
      const nextImage = await readFileAsDataUrl(file)
      onApply(nextImage)
      setStatusMessage(successMessage || `${file.name} selected successfully.`)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load the selected image file.')
    }
  }

  function handleAddHeroSlide() {
    const nextSlideTitle = draft?.hero?.title?.trim() || `Banner ${heroSlides.length + 1}`
    const nextSlideSubtitle = draft?.hero?.subtitle?.trim() || 'Add banner subtitle'
    const defaultImage =
      heroSlides[heroSlides.length - 1]?.image || '/images/hero-banner-ashwagandha-final.png'

    updateDraft((nextDraft) => {
      nextDraft.hero.slides.push({
        id: `slide-${Date.now()}`,
        title: nextSlideTitle,
        subtitle: nextSlideSubtitle,
        image: defaultImage,
        alt: `${nextSlideTitle} ${nextSlideSubtitle}`.trim(),
      })
    })
    setStatusMessage(`Slide ${heroSlides.length + 1} added to hero banner.`)
    setErrorMessage('')
  }

  function handleRemoveHeroSlide(index) {
    if (heroSlides.length <= 1) {
      setErrorMessage('At least one hero banner slide is required.')
      return
    }

    updateDraft((nextDraft) => {
      nextDraft.hero.slides = nextDraft.hero.slides.filter((_, slideIndex) => slideIndex !== index)
    })
    setStatusMessage(`Slide ${index + 1} removed from hero banner.`)
    setErrorMessage('')
  }

  function handleAddProduct() {
    const productName = newProductForm.name.trim()
    const productId = slugifyValue(newProductForm.id || productName)

    if (!productName || !productId) {
      setErrorMessage('Product name and product id are required before adding a product.')
      return
    }

    if ((draft?.shop?.products ?? []).some((product) => product.id === productId)) {
      setErrorMessage('A product with this id already exists in the catalog.')
      return
    }

    const price = Number(newProductForm.price)
    const originalPrice = Number(newProductForm.originalPrice) || price
    const discountValue =
      originalPrice > price
        ? Math.max(5, Math.round(((originalPrice - price) / originalPrice) * 100))
        : 0

    updateDraft((nextDraft) => {
      nextDraft.shop.products.unshift({
        id: productId,
        badge: discountValue > 0 ? `save ${discountValue}%` : 'new launch',
        name: productName,
        rating: 5,
        price,
        originalPrice,
        category: newProductForm.category.trim() || 'Herbal Care',
        image: newProductForm.image.trim() || '/images/products/giloy-capsules.png',
        summary: newProductForm.summary.trim(),
        benefits: [
          `${productName} supports daily herbal wellness.`,
          'Suitable for modern Ayurvedic self-care routines.',
          'Crafted for easy daily use and premium presentation.',
        ],
        tags: ['Pickup', 'Delivery'],
        reviewCount: 0,
        createdAt: '2026-07-12',
        inStock: true,
        onSale: discountValue > 0,
        visualTheme: 'sage',
      })
    })

    setNewProductForm(createProductForm())
    setStatusMessage(`${productName} added to the draft catalog.`)
    setErrorMessage('')
    navigateToView('products-all-products', 'All Products')
  }

  function handleAddCoupon() {
    if (!couponForm.code.trim()) {
      setErrorMessage('Coupon code is required.')
      return
    }

    updateDraft((nextDraft) => {
      const nextCoupons = Array.isArray(nextDraft.coupons)
        ? [...nextDraft.coupons]
        : createDefaultCoupons()

      nextCoupons.unshift({
        id: `coupon-${Date.now()}`,
        code: couponForm.code.trim().toUpperCase(),
        discount: `${couponForm.discount.trim()}%`,
        description: couponForm.description.trim(),
        expiresOn: new Date(`${couponForm.expiresOn}T00:00:00`).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: couponForm.status,
      })

      nextDraft.coupons = nextCoupons
    })

    setCouponForm(createCouponForm())
    setStatusMessage('Coupon draft added successfully.')
    setErrorMessage('')
  }

  async function handleProfileSubmit(event) {
    event.preventDefault()

    const displayName = profileForm.displayName.trim()
    const identifier = profileForm.identifier.trim().toLowerCase()

    if (!displayName || !identifier) {
      setErrorMessage('Admin name and email are required before saving the profile.')
      return
    }

    setIsProfileSaving(true)
    setStatusMessage('')
    setErrorMessage('')

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSession.token}`,
        },
        body: JSON.stringify({
          displayName,
          identifier,
        }),
      })

      if (response.status === 401) {
        onAdminSessionExpired?.()
        return
      }

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to update admin profile.')
      }

      onAdminSessionUpdated?.(payload.session)
      setStatusMessage(payload.message || 'Admin profile updated successfully.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update admin profile.')
    } finally {
      setIsProfileSaving(false)
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()

    if (!passwordForm.currentPassword || !passwordForm.nextPassword || !passwordForm.confirmPassword) {
      setErrorMessage('Please complete all password fields.')
      return
    }

    if (passwordForm.nextPassword !== passwordForm.confirmPassword) {
      setErrorMessage('New password and confirm password do not match.')
      return
    }

    setIsPasswordSaving(true)
    setStatusMessage('')
    setErrorMessage('')

    try {
      const response = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSession.token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          nextPassword: passwordForm.nextPassword,
        }),
      })

      if (response.status === 401) {
        onAdminSessionExpired?.()
        return
      }

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to update admin password.')
      }

      setPasswordForm({
        currentPassword: '',
        nextPassword: '',
        confirmPassword: '',
      })
      setStatusMessage(payload.message || 'Admin password updated successfully.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update admin password.')
    } finally {
      setIsPasswordSaving(false)
    }
  }

  const heroSlides = Array.isArray(draft?.hero?.slides) ? draft.hero.slides : []
  const categories = Array.isArray(draft?.categories) ? draft.categories : []
  const productCatalog = Array.isArray(draft?.shop?.products) ? draft.shop.products : []
  const promiseCards = Array.isArray(draft?.about?.promiseCards) ? draft.about.promiseCards : []
  const aboutValues = Array.isArray(draft?.about?.values) ? draft.about.values : []
  const blogPosts = Array.isArray(draft?.about?.blog?.posts) ? draft.about.blog.posts : []
  const contactBlocks = Array.isArray(draft?.contact?.infoBlocks) ? draft.contact.infoBlocks : []
  const featuredSections = Array.isArray(draft?.sections) ? draft.sections : []
  const paymentEntries = Array.isArray(draft?.footer?.payments) ? draft.footer.payments : []
  const trustBadges = Array.isArray(draft?.trustBadges) ? draft.trustBadges : []
  const rootsPillars = Array.isArray(draft?.roots?.pillars) ? draft.roots.pillars : []
  const testimonialEntries = Array.isArray(draft?.testimonials?.entries) ? draft.testimonials.entries : []
  const headerPrimaryLinks = Array.isArray(draft?.header?.primaryLinks) ? draft.header.primaryLinks : []
  const footerCustomerLinks = Array.isArray(draft?.footer?.customerLinks) ? draft.footer.customerLinks : []
  const footerQuickLinks = Array.isArray(draft?.footer?.quickLinks) ? draft.footer.quickLinks : []
  const couponEntries = Array.isArray(draft?.coupons) ? draft.coupons : createDefaultCoupons()
  const workspaceData = useMemo(
    () => buildAdminWorkspaceData(draft, userAccounts, orderRecords),
    [draft, orderRecords, userAccounts],
  )
  const activeMenuItem = useMemo(() => adminViewMap.get(activeView) ?? adminMenuItems[0], [activeView])
  const searchedProductCatalog = useMemo(
    () => productCatalog.filter((product) => matchesSearch(product, searchQuery)),
    [productCatalog, searchQuery],
  )

  function renderToneBadge(value) {
    const normalizedValue = String(value || '').toLowerCase()
    let className = 'admin-status admin-status--payment-paid'

    if (
      normalizedValue.includes('failed') ||
      normalizedValue.includes('blocked') ||
      normalizedValue.includes('rejected') ||
      normalizedValue.includes('expired') ||
      normalizedValue.includes('cancelled') ||
      normalizedValue.includes('refunded')
    ) {
      className = 'admin-status admin-status--payment-failed'
    } else if (
      normalizedValue.includes('new') ||
      normalizedValue.includes('pending') ||
      normalizedValue.includes('cod') ||
      normalizedValue.includes('expiring')
    ) {
      className = 'admin-status admin-status--alert-expiring-soon'
    } else if (
      normalizedValue.includes('shipped') ||
      normalizedValue.includes('low stock')
    ) {
      className = 'admin-status admin-status--order-shipped'
    }

    return <span className={className}>{value}</span>
  }

  function renderGeneralSettingsCard() {
    return (
      <AdminSectionCard
        title="Store Essentials"
        subtitle="Header, promo bar, footer contact, newsletter aur navigation links."
      >
        <div className="admin-grid admin-grid--two">
          <AdminInput
            label="Brand Name"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.header.brand = event.target.value
              })
            }
            value={draft?.header?.brand ?? ''}
          />
          <AdminInput
            label="Promo Phone"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.promoBar.phone = event.target.value
              })
            }
            value={draft?.promoBar?.phone ?? ''}
          />
          <AdminInput
            label="Promo Note"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.promoBar.note = event.target.value
              })
            }
            value={draft?.promoBar?.note ?? ''}
          />
          <AdminInput
            label="Promo Highlight"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.promoBar.highlight = event.target.value
              })
            }
            value={draft?.promoBar?.highlight ?? ''}
          />
          <AdminInput
            label="Header Search Placeholder"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.header.searchPlaceholder = event.target.value
              })
            }
            value={draft?.header?.searchPlaceholder ?? ''}
          />
          <AdminInput
            label="Header Categories Label"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.header.categoriesLabel = event.target.value
              })
            }
            value={draft?.header?.categoriesLabel ?? ''}
          />
          <AdminInput
            label="Footer Address"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.footer.address = event.target.value
              })
            }
            value={draft?.footer?.address ?? ''}
          />
          <AdminInput
            label="Footer Phone"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.footer.phone = event.target.value
              })
            }
            value={draft?.footer?.phone ?? ''}
          />
          <AdminInput
            label="Newsletter Title"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.footer.newsletterTitle = event.target.value
              })
            }
            value={draft?.footer?.newsletterTitle ?? ''}
          />
          <AdminInput
            label="Newsletter Placeholder"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.footer.newsletterPlaceholder = event.target.value
              })
            }
            value={draft?.footer?.newsletterPlaceholder ?? ''}
          />
          <AdminInput
            label="Newsletter Button"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.footer.newsletterCta = event.target.value
              })
            }
            value={draft?.footer?.newsletterCta ?? ''}
          />
          <AdminInput
            label="Address Label"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.footer.addressLabel = event.target.value
              })
            }
            value={draft?.footer?.addressLabel ?? ''}
          />
          <AdminInput
            label="Phone Label"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.footer.phoneLabel = event.target.value
              })
            }
            value={draft?.footer?.phoneLabel ?? ''}
          />
          <AdminInput
            label="Footer Copyright"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.footer.copyright = event.target.value
              })
            }
            value={draft?.footer?.copyright ?? ''}
          />
        </div>

        <AdminTextarea
          hint="Har line me ek navigation item likho. Example: Home, Shop, About Us, Contact."
          label="Header Navigation Links"
          onChange={(event) =>
            updateDraft((nextDraft) => {
              nextDraft.header.primaryLinks = splitLines(event.target.value)
            })
          }
          rows={4}
          value={headerPrimaryLinks.join('\n')}
        />

        <AdminTextarea
          hint="Footer customer column ke links ko line by line manage karo."
          label="Footer Customer Links"
          onChange={(event) =>
            updateDraft((nextDraft) => {
              nextDraft.footer.customerLinks = splitLines(event.target.value)
            })
          }
          rows={4}
          value={footerCustomerLinks.join('\n')}
        />

        <AdminTextarea
          hint="Footer quick links ko line by line manage karo."
          label="Footer Quick Links"
          onChange={(event) =>
            updateDraft((nextDraft) => {
              nextDraft.footer.quickLinks = splitLines(event.target.value)
            })
          }
          rows={5}
          value={footerQuickLinks.join('\n')}
        />
      </AdminSectionCard>
    )
  }

  function renderAboutSettingsCard() {
    return (
      <AdminSectionCard
        title="About Page Content"
        subtitle="About hero, story section aur blog cards ko manage karo."
      >
        <div className="admin-grid admin-grid--two">
          <AdminInput
            label="Hero Eyebrow"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.about.eyebrow = event.target.value
              })
            }
            value={draft?.about?.eyebrow ?? ''}
          />
          <AdminInput
            label="Hero Title"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.about.heroTitle = event.target.value
              })
            }
            value={draft?.about?.heroTitle ?? ''}
          />
          <AdminInput
            label="Story Eyebrow"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.about.story.eyebrow = event.target.value
              })
            }
            value={draft?.about?.story?.eyebrow ?? ''}
          />
          <AdminInput
            label="Story Title"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.about.story.title = event.target.value
              })
            }
            value={draft?.about?.story?.title ?? ''}
          />
          <AdminInput
            label="Story Image"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.about.story.image = event.target.value
              })
            }
            value={draft?.about?.story?.image ?? ''}
          />
          <AdminInput
            label="Story Image Alt"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.about.story.imageAlt = event.target.value
              })
            }
            value={draft?.about?.story?.imageAlt ?? ''}
          />
          <AdminInput
            label="Decorative Mark Image"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.about.story.markImage = event.target.value
              })
            }
            value={draft?.about?.story?.markImage ?? ''}
          />
        </div>

        <AdminTextarea
          hint="Each line ko alag paragraph ki tarah use kiya jayega."
          label="Story Paragraphs"
          onChange={(event) =>
            updateDraft((nextDraft) => {
              nextDraft.about.story.paragraphs = event.target.value
                .split('\n')
                .map((value) => value.trim())
                .filter(Boolean)
            })
          }
          rows={5}
          value={(draft?.about?.story?.paragraphs ?? []).join('\n')}
        />

        <div className="admin-overview-grid">
          <div className="admin-overview-item">
            <span>Promise Cards</span>
            <strong>{promiseCards.length}</strong>
          </div>
          <div className="admin-overview-item">
            <span>Values</span>
            <strong>{aboutValues.length}</strong>
          </div>
          <div className="admin-overview-item">
            <span>Blog Posts</span>
            <strong>{blogPosts.length}</strong>
          </div>
          <div className="admin-overview-item">
            <span>Advanced Edit</span>
            <strong>JSON Ready</strong>
          </div>
        </div>
      </AdminSectionCard>
    )
  }

  function renderAboutCollectionsCard() {
    return (
      <>
        <AdminSectionCard
          title="About Promise Cards"
          subtitle="About hero ke niche dikhne wale promise cards ko yahan se manage karo."
          actions={
            <button
              className="admin-button admin-button--ghost"
              onClick={() =>
                updateDraft((nextDraft) => {
                  nextDraft.about.promiseCards.push({
                    id: `promise-${Date.now()}`,
                    title: 'New Promise',
                    text: 'Add your promise text here.',
                  })
                })
              }
              type="button"
            >
              Add Promise Card
            </button>
          }
        >
          <div className="admin-stack">
            {promiseCards.map((card, index) => (
              <article className="admin-repeat-card" key={card.id || index}>
                <div className="admin-repeat-card__header">
                  <strong>Promise Card {index + 1}</strong>
                  {promiseCards.length > 1 ? (
                    <button
                      className="admin-text-button is-danger"
                      onClick={() =>
                        updateDraft((nextDraft) => {
                          nextDraft.about.promiseCards = nextDraft.about.promiseCards.filter(
                            (_, cardIndex) => cardIndex !== index,
                          )
                        })
                      }
                      type="button"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Card ID"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.promiseCards = updateArrayItem(
                          nextDraft.about.promiseCards,
                          index,
                          'id',
                          event.target.value,
                        )
                      })
                    }
                    value={card.id ?? ''}
                  />
                  <AdminInput
                    label="Card Title"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.promiseCards = updateArrayItem(
                          nextDraft.about.promiseCards,
                          index,
                          'title',
                          event.target.value,
                        )
                      })
                    }
                    value={card.title ?? ''}
                  />
                </div>

                <AdminTextarea
                  label="Card Text"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.about.promiseCards = updateArrayItem(
                        nextDraft.about.promiseCards,
                        index,
                        'text',
                        event.target.value,
                      )
                    })
                  }
                  rows={3}
                  value={card.text ?? ''}
                />
              </article>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="About Value Points"
          subtitle="About section ke numbered value cards ko update karo."
          actions={
            <button
              className="admin-button admin-button--ghost"
              onClick={() =>
                updateDraft((nextDraft) => {
                  nextDraft.about.values.push({
                    id: `value-${Date.now()}`,
                    number: `0${nextDraft.about.values.length + 1}`,
                    title: 'New Value',
                    text: 'Add value description here.',
                  })
                })
              }
              type="button"
            >
              Add Value Point
            </button>
          }
        >
          <div className="admin-stack">
            {aboutValues.map((valueItem, index) => (
              <article className="admin-repeat-card" key={valueItem.id || index}>
                <div className="admin-repeat-card__header">
                  <strong>Value Card {index + 1}</strong>
                  {aboutValues.length > 1 ? (
                    <button
                      className="admin-text-button is-danger"
                      onClick={() =>
                        updateDraft((nextDraft) => {
                          nextDraft.about.values = nextDraft.about.values.filter(
                            (_, valueIndex) => valueIndex !== index,
                          )
                        })
                      }
                      type="button"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Value ID"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.values = updateArrayItem(
                          nextDraft.about.values,
                          index,
                          'id',
                          event.target.value,
                        )
                      })
                    }
                    value={valueItem.id ?? ''}
                  />
                  <AdminInput
                    label="Number"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.values = updateArrayItem(
                          nextDraft.about.values,
                          index,
                          'number',
                          event.target.value,
                        )
                      })
                    }
                    value={valueItem.number ?? ''}
                  />
                  <AdminInput
                    label="Title"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.values = updateArrayItem(
                          nextDraft.about.values,
                          index,
                          'title',
                          event.target.value,
                        )
                      })
                    }
                    value={valueItem.title ?? ''}
                  />
                </div>

                <AdminTextarea
                  label="Description"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.about.values = updateArrayItem(
                        nextDraft.about.values,
                        index,
                        'text',
                        event.target.value,
                      )
                    })
                  }
                  rows={3}
                  value={valueItem.text ?? ''}
                />
              </article>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="About Blog Posts"
          subtitle="About page ke recent post section ko admin panel se update karo."
          actions={
            <button
              className="admin-button admin-button--ghost"
              onClick={() =>
                updateDraft((nextDraft) => {
                  nextDraft.about.blog.posts.push({
                    id: `blog-${Date.now()}`,
                    date: '13 Jul 2026',
                    author: 'By Admin',
                    title: 'New blog title',
                    image: '/images/products/amla-powder.png',
                  })
                })
              }
              type="button"
            >
              Add Blog Post
            </button>
          }
        >
          <div className="admin-grid admin-grid--two">
            <AdminInput
              label="Blog Eyebrow"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.about.blog.eyebrow = event.target.value
                })
              }
              value={draft?.about?.blog?.eyebrow ?? ''}
            />
            <AdminInput
              label="Blog Section Title"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.about.blog.title = event.target.value
                })
              }
              value={draft?.about?.blog?.title ?? ''}
            />
          </div>

          <div className="admin-stack">
            {blogPosts.map((post, index) => (
              <article className="admin-repeat-card" key={post.id || index}>
                <div className="admin-repeat-card__header">
                  <strong>Blog Post {index + 1}</strong>
                  {blogPosts.length > 1 ? (
                    <button
                      className="admin-text-button is-danger"
                      onClick={() =>
                        updateDraft((nextDraft) => {
                          nextDraft.about.blog.posts = nextDraft.about.blog.posts.filter(
                            (_, postIndex) => postIndex !== index,
                          )
                        })
                      }
                      type="button"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Post ID"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.blog.posts = updateArrayItem(
                          nextDraft.about.blog.posts,
                          index,
                          'id',
                          event.target.value,
                        )
                      })
                    }
                    value={post.id ?? ''}
                  />
                  <AdminInput
                    label="Date"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.blog.posts = updateArrayItem(
                          nextDraft.about.blog.posts,
                          index,
                          'date',
                          event.target.value,
                        )
                      })
                    }
                    value={post.date ?? ''}
                  />
                  <AdminInput
                    label="Author"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.blog.posts = updateArrayItem(
                          nextDraft.about.blog.posts,
                          index,
                          'author',
                          event.target.value,
                        )
                      })
                    }
                    value={post.author ?? ''}
                  />
                  <AdminInput
                    label="Image Path"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.blog.posts = updateArrayItem(
                          nextDraft.about.blog.posts,
                          index,
                          'image',
                          event.target.value,
                        )
                      })
                    }
                    value={post.image ?? ''}
                  />
                </div>

                <AdminTextarea
                  label="Blog Title"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.about.blog.posts = updateArrayItem(
                        nextDraft.about.blog.posts,
                        index,
                        'title',
                        event.target.value,
                      )
                    })
                  }
                  rows={3}
                  value={post.title ?? ''}
                />
              </article>
            ))}
          </div>
        </AdminSectionCard>
      </>
    )
  }

  function renderHomeExperienceCard() {
    return (
      <>
        <AdminSectionCard
          title="Home Roots Section"
          subtitle="Homepage ke Our Roots block aur pillar cards yahan se manage karo."
          actions={
            <button
              className="admin-button admin-button--ghost"
              onClick={() =>
                updateDraft((nextDraft) => {
                  nextDraft.roots.pillars.push({
                    id: `pillar-${Date.now()}`,
                    label: 'New Pillar',
                    icon: 'leaf',
                    image: '/images/pillars/natural-safe.png',
                  })
                })
              }
              type="button"
            >
              Add Pillar
            </button>
          }
        >
          <div className="admin-grid admin-grid--two">
            <AdminInput
              label="Roots Title"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.roots.title = event.target.value
                })
              }
              value={draft?.roots?.title ?? ''}
            />
            <AdminInput
              label="Roots CTA Label"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.roots.ctaLabel = event.target.value
                })
              }
              value={draft?.roots?.ctaLabel ?? ''}
            />
          </div>

          <AdminTextarea
            label="Roots Description"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.roots.description = event.target.value
              })
            }
            rows={4}
            value={draft?.roots?.description ?? ''}
          />

          <div className="admin-stack">
            {rootsPillars.map((pillar, index) => (
              <article className="admin-repeat-card" key={pillar.id || index}>
                <div className="admin-repeat-card__header">
                  <strong>Pillar {index + 1}</strong>
                  {rootsPillars.length > 1 ? (
                    <button
                      className="admin-text-button is-danger"
                      onClick={() =>
                        updateDraft((nextDraft) => {
                          nextDraft.roots.pillars = nextDraft.roots.pillars.filter(
                            (_, pillarIndex) => pillarIndex !== index,
                          )
                        })
                      }
                      type="button"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Pillar ID"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.roots.pillars = updateArrayItem(
                          nextDraft.roots.pillars,
                          index,
                          'id',
                          event.target.value,
                        )
                      })
                    }
                    value={pillar.id ?? ''}
                  />
                  <AdminInput
                    label="Icon Name"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.roots.pillars = updateArrayItem(
                          nextDraft.roots.pillars,
                          index,
                          'icon',
                          event.target.value,
                        )
                      })
                    }
                    value={pillar.icon ?? ''}
                  />
                  <AdminInput
                    label="Label"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.roots.pillars = updateArrayItem(
                          nextDraft.roots.pillars,
                          index,
                          'label',
                          event.target.value,
                        )
                      })
                    }
                    value={pillar.label ?? ''}
                  />
                  <AdminInput
                    label="Image Path"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.roots.pillars = updateArrayItem(
                          nextDraft.roots.pillars,
                          index,
                          'image',
                          event.target.value,
                        )
                      })
                    }
                    value={pillar.image ?? ''}
                  />
                </div>
              </article>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Homepage Testimonials"
          subtitle="Real stories section ke title aur customer reviews yahan se control karo."
          actions={
            <button
              className="admin-button admin-button--ghost"
              onClick={() =>
                updateDraft((nextDraft) => {
                  nextDraft.testimonials.entries.push({
                    id: `story-${Date.now()}`,
                    author: 'New Customer',
                    quote: 'Add testimonial quote here.',
                    stars: 5,
                    status: 'Approved',
                    date: formatDateLabel(new Date().toISOString()),
                  })
                })
              }
              type="button"
            >
              Add Story
            </button>
          }
        >
          <AdminInput
            label="Testimonials Section Title"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.testimonials.title = event.target.value
              })
            }
            value={draft?.testimonials?.title ?? ''}
          />

          <div className="admin-stack">
            {testimonialEntries.map((story, index) => (
              <article className="admin-repeat-card" key={story.id || index}>
                <div className="admin-repeat-card__header">
                  <strong>Story {index + 1}</strong>
                  {testimonialEntries.length > 1 ? (
                    <button
                      className="admin-text-button is-danger"
                      onClick={() =>
                        updateDraft((nextDraft) => {
                          nextDraft.testimonials.entries = nextDraft.testimonials.entries.filter(
                            (_, storyIndex) => storyIndex !== index,
                          )
                        })
                      }
                      type="button"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Story ID"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.testimonials.entries = updateArrayItem(
                          nextDraft.testimonials.entries,
                          index,
                          'id',
                          event.target.value,
                        )
                      })
                    }
                    value={story.id ?? ''}
                  />
                  <AdminInput
                    label="Author"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.testimonials.entries = updateArrayItem(
                          nextDraft.testimonials.entries,
                          index,
                          'author',
                          event.target.value,
                        )
                      })
                    }
                    value={story.author ?? ''}
                  />
                  <AdminInput
                    label="Stars"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.testimonials.entries = updateArrayItem(
                          nextDraft.testimonials.entries,
                          index,
                          'stars',
                          Number(event.target.value) || 5,
                        )
                      })
                    }
                    type="number"
                    value={story.stars ?? 5}
                  />
                </div>

                <AdminTextarea
                  label="Quote"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.testimonials.entries = updateArrayItem(
                        nextDraft.testimonials.entries,
                        index,
                        'quote',
                        event.target.value,
                      )
                    })
                  }
                  rows={4}
                  value={story.quote ?? ''}
                />
              </article>
            ))}
          </div>
        </AdminSectionCard>
      </>
    )
  }

  function renderContactSettingsCard() {
    return (
      <AdminSectionCard
        title="Contact Page"
        subtitle="Contact heading, map aur support blocks yahan se control karo."
        actions={
          <button
            className="admin-button admin-button--ghost"
            onClick={() =>
              updateDraft((nextDraft) => {
                nextDraft.contact.infoBlocks.push({
                  id: `info-${Date.now()}`,
                  icon: 'phone',
                  title: 'New Block',
                  value: 'Add contact info',
                  note: '',
                })
              })
            }
            type="button"
          >
            Add Info Block
          </button>
        }
      >
        <div className="admin-grid admin-grid--two">
          <AdminInput
            label="Contact Eyebrow"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.contact.eyebrow = event.target.value
              })
            }
            value={draft?.contact?.eyebrow ?? ''}
          />
          <AdminInput
            label="Contact Hero Title"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.contact.heroTitle = event.target.value
              })
            }
            value={draft?.contact?.heroTitle ?? ''}
          />
          <AdminInput
            label="Google Map Embed URL"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.contact.mapUrl = event.target.value
              })
            }
            value={draft?.contact?.mapUrl ?? ''}
          />
          <AdminInput
            label="Form Submit Button"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.contact.formSubmitLabel = event.target.value
              })
            }
            value={draft?.contact?.formSubmitLabel ?? ''}
          />
          <AdminInput
            label="Form Title"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.contact.formTitle = event.target.value
              })
            }
            value={draft?.contact?.formTitle ?? ''}
          />
          <AdminInput
            label="Form Placeholder"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.contact.formPlaceholder = event.target.value
              })
            }
            value={draft?.contact?.formPlaceholder ?? ''}
          />
          <AdminInput
            label="Info Section Title"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.contact.infoTitle = event.target.value
              })
            }
            value={draft?.contact?.infoTitle ?? ''}
          />
          <AdminInput
            label="Success Message"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.contact.successMessage = event.target.value
              })
            }
            value={draft?.contact?.successMessage ?? ''}
          />
        </div>

        <AdminTextarea
          label="Checkbox Helper Label"
          onChange={(event) =>
            updateDraft((nextDraft) => {
              nextDraft.contact.formCheckboxLabel = event.target.value
            })
          }
          rows={3}
          value={draft?.contact?.formCheckboxLabel ?? ''}
        />

        <div className="admin-stack">
          {contactBlocks.map((block, index) => (
            <article className="admin-repeat-card" key={block.id || index}>
              <div className="admin-repeat-card__header">
                <strong>Info Block {index + 1}</strong>
                {contactBlocks.length > 1 ? (
                  <button
                    className="admin-text-button is-danger"
                    onClick={() =>
                      updateDraft((nextDraft) => {
                        nextDraft.contact.infoBlocks = nextDraft.contact.infoBlocks.filter(
                          (_, blockIndex) => blockIndex !== index,
                        )
                      })
                    }
                    type="button"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="admin-grid admin-grid--two">
                <AdminInput
                  label="Block ID"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.contact.infoBlocks = updateArrayItem(
                        nextDraft.contact.infoBlocks,
                        index,
                        'id',
                        event.target.value,
                      )
                    })
                  }
                  value={block.id ?? ''}
                />
                <AdminInput
                  label="Icon Name"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.contact.infoBlocks = updateArrayItem(
                        nextDraft.contact.infoBlocks,
                        index,
                        'icon',
                        event.target.value,
                      )
                    })
                  }
                  value={block.icon ?? ''}
                />
                <AdminInput
                  label="Title"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.contact.infoBlocks = updateArrayItem(
                        nextDraft.contact.infoBlocks,
                        index,
                        'title',
                        event.target.value,
                      )
                    })
                  }
                  value={block.title ?? ''}
                />
                <AdminInput
                  label="Value"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.contact.infoBlocks = updateArrayItem(
                        nextDraft.contact.infoBlocks,
                        index,
                        'value',
                        event.target.value,
                      )
                    })
                  }
                  value={block.value ?? ''}
                />
              </div>

              <AdminTextarea
                label="Helper Note"
                onChange={(event) =>
                  updateDraft((nextDraft) => {
                    nextDraft.contact.infoBlocks = updateArrayItem(
                      nextDraft.contact.infoBlocks,
                      index,
                      'note',
                      event.target.value,
                    )
                  })
                }
                rows={3}
                value={block.note ?? ''}
              />
            </article>
          ))}
        </div>
      </AdminSectionCard>
    )
  }

  function renderFullJsonCard() {
    return (
      <AdminSectionCard
        title="Full Website JSON"
        subtitle="Raw payload edit karne ke liye pehle Apply Full JSON aur phir Save Website Changes use karo."
        actions={
          <button className="admin-button admin-button--ghost" onClick={applyFullJson} type="button">
            Apply Full JSON
          </button>
        }
      >
        <AdminTextarea
          hint="A to Z management ke liye poora website payload yahan edit karo."
          label="Full Site Content JSON"
          onChange={(event) => {
            setFullJson(event.target.value)
            setFullJsonDirty(true)
          }}
          rows={20}
          value={fullJson}
        />
      </AdminSectionCard>
    )
  }

  function renderHeroBannerCard({
    allowAdd = true,
    title = 'Hero Banner Manager',
    subtitle = 'Top homepage slider ke text aur images yahin se edit karo.',
  } = {}) {
    return (
      <AdminSectionCard
        title={title}
        subtitle={subtitle}
        actions={
          allowAdd ? (
            <button className="admin-button admin-button--ghost" onClick={handleAddHeroSlide} type="button">
              Add Slide
            </button>
          ) : null
        }
      >
        <div className="admin-grid admin-grid--two">
          <AdminInput
            label="Hero Main Title"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.hero.title = event.target.value
              })
            }
            value={draft?.hero?.title ?? ''}
          />
          <AdminInput
            label="Hero Main Subtitle"
            onChange={(event) =>
              updateDraft((nextDraft) => {
                nextDraft.hero.subtitle = event.target.value
              })
            }
            value={draft?.hero?.subtitle ?? ''}
          />
        </div>

        <div className="admin-banner-grid">
          {heroSlides.map((slide, index) => (
            <article className="admin-banner-card" key={slide.id || index}>
              <div className="admin-banner-card__media">
                <img alt={slide.alt ?? slide.title ?? `Slide ${index + 1}`} src={slide.image} />
              </div>
              <div className="admin-banner-card__body">
                <strong>{slide.title || `Slide ${index + 1}`}</strong>
                <span>{slide.subtitle || 'Banner subtitle pending'}</span>
                <p>{slide.alt || 'Alt text pending'}</p>
                <div className="admin-banner-card__actions">
                  <span className="admin-banner-card__tag">Slide {index + 1}</span>
                  {heroSlides.length > 1 ? (
                    <button
                      className="admin-text-button is-danger"
                      onClick={() => handleRemoveHeroSlide(index)}
                      type="button"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="admin-stack">
          {heroSlides.map((slide, index) => (
            <article className="admin-repeat-card" key={slide.id || index}>
              <div className="admin-repeat-card__header">
                <strong>Slide {index + 1}</strong>
                {heroSlides.length > 1 ? (
                  <button
                    className="admin-text-button is-danger"
                    onClick={() => handleRemoveHeroSlide(index)}
                    type="button"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="admin-grid admin-grid--two">
                <AdminInput
                  label="Slide ID"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.hero.slides = updateArrayItem(
                        nextDraft.hero.slides,
                        index,
                        'id',
                        event.target.value,
                      )
                    })
                  }
                  value={slide.id ?? ''}
                />
                <AdminInput
                  label="Alt Text"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.hero.slides = updateArrayItem(
                        nextDraft.hero.slides,
                        index,
                        'alt',
                        event.target.value,
                      )
                    })
                  }
                  value={slide.alt ?? ''}
                />
                <AdminInput
                  label="Slide Title"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.hero.slides = updateArrayItem(
                        nextDraft.hero.slides,
                        index,
                        'title',
                        event.target.value,
                      )
                    })
                  }
                  value={slide.title ?? ''}
                />
                <AdminInput
                  label="Slide Subtitle"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.hero.slides = updateArrayItem(
                        nextDraft.hero.slides,
                        index,
                        'subtitle',
                        event.target.value,
                      )
                    })
                  }
                  value={slide.subtitle ?? ''}
                />
              </div>

              <AdminImageInput
                hint="Local image file select karo. Yeh banner ke current draft me save ho jayegi."
                label="Slide Image"
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  event.target.value = ''

                  await handleImageFileSelection(
                    file,
                    (nextImage) =>
                      updateDraft((nextDraft) => {
                        nextDraft.hero.slides = updateArrayItem(
                          nextDraft.hero.slides,
                          index,
                          'image',
                          nextImage,
                        )
                      }),
                    `${file?.name ?? 'Banner image'} added to slide ${index + 1}.`,
                  )
                }}
                previewAlt={slide.alt ?? slide.title ?? `Slide ${index + 1}`}
                previewSrc={slide.image ?? ''}
              />
            </article>
          ))}
        </div>
      </AdminSectionCard>
    )
  }

  function renderCategoriesCard() {
    return (
      <AdminSectionCard
        title="Category Cards"
        subtitle="Homepage category cards ke title, subtitle aur images yahan edit karo."
        actions={
          <button
            className="admin-button admin-button--ghost"
            onClick={() =>
              updateDraft((nextDraft) => {
                nextDraft.categories.push({
                  id: `category-${Date.now()}`,
                  title: 'New Category',
                  subtitle: 'Category subtitle',
                  image: '/images/categories/digestive-care.avif',
                  tone: 'mint',
                })
              })
            }
            type="button"
          >
            Add Category
          </button>
        }
      >
        <div className="admin-stack">
          {categories.map((category, index) => (
            <article className="admin-repeat-card" key={category.id || index}>
              <div className="admin-repeat-card__header">
                <strong>Category {index + 1}</strong>
                {categories.length > 1 ? (
                  <button
                    className="admin-text-button is-danger"
                    onClick={() =>
                      updateDraft((nextDraft) => {
                        nextDraft.categories = nextDraft.categories.filter(
                          (_, categoryIndex) => categoryIndex !== index,
                        )
                      })
                    }
                    type="button"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="admin-grid admin-grid--two">
                <AdminInput
                  label="Category ID"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.categories = updateArrayItem(
                        nextDraft.categories,
                        index,
                        'id',
                        event.target.value,
                      )
                    })
                  }
                  value={category.id ?? ''}
                />
                <AdminInput
                  label="Tone"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.categories = updateArrayItem(
                        nextDraft.categories,
                        index,
                        'tone',
                        event.target.value,
                      )
                    })
                  }
                  value={category.tone ?? ''}
                />
                <AdminInput
                  label="Category Title"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.categories = updateArrayItem(
                        nextDraft.categories,
                        index,
                        'title',
                        event.target.value,
                      )
                    })
                  }
                  value={category.title ?? ''}
                />
                <AdminInput
                  label="Category Subtitle"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.categories = updateArrayItem(
                        nextDraft.categories,
                        index,
                        'subtitle',
                        event.target.value,
                      )
                    })
                  }
                  value={category.subtitle ?? ''}
                />
              </div>

              <AdminInput
                label="Image Path / URL"
                onChange={(event) =>
                  updateDraft((nextDraft) => {
                    nextDraft.categories = updateArrayItem(
                      nextDraft.categories,
                      index,
                      'image',
                      event.target.value,
                    )
                  })
                }
                value={category.image ?? ''}
              />
            </article>
          ))}
        </div>
      </AdminSectionCard>
    )
  }

  function renderShopCatalogCards() {
    return (
      <>
        <AdminSectionCard
          title="Shop Banner & Product Catalog"
          subtitle="Shop banner ke text aur pura product catalog JSON format me manage karo."
          actions={
            <button className="admin-button admin-button--ghost" onClick={applyProductsJson} type="button">
              Apply Product JSON
            </button>
          }
        >
          <div className="admin-grid admin-grid--two">
            <AdminInput
              label="Banner Eyebrow"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.shop.banner.eyebrow = event.target.value
                })
              }
              value={draft?.shop?.banner?.eyebrow ?? ''}
            />
            <AdminInput
              label="Banner CTA"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.shop.banner.ctaLabel = event.target.value
                })
              }
              value={draft?.shop?.banner?.ctaLabel ?? ''}
            />
            <AdminInput
              label="Banner Title"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.shop.banner.title = event.target.value
                })
              }
              value={draft?.shop?.banner?.title ?? ''}
            />
          </div>

          <AdminImageInput
            hint="Direct file select karke shop banner image replace kar sakte ho. URL field ab remove kar diya gaya hai."
            label="Shop Banner Image"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              event.target.value = ''

              await handleImageFileSelection(
                file,
                (nextImage) =>
                  updateDraft((nextDraft) => {
                    nextDraft.shop.banner.image = nextImage
                  }),
                `${file?.name ?? 'Banner image'} added to shop banner.`,
              )
            }}
            previewAlt={draft?.shop?.banner?.title ?? 'Shop banner'}
            previewSrc={draft?.shop?.banner?.image ?? ''}
          />

          <AdminTextarea
            hint="Yahan poora product array JSON me edit karo. Save se pehle Apply Product JSON dabao."
            label="Product Catalog JSON"
            onChange={(event) => {
              setProductsJson(event.target.value)
              setProductsJsonDirty(true)
            }}
            rows={18}
            value={productsJson}
          />
        </AdminSectionCard>

        <AdminDataTable
          columns={[
            { key: 'name', label: 'Product Name' },
            { key: 'category', label: 'Category' },
            {
              key: 'price',
              label: 'Price',
              render: (row) => formatMoney(row.price),
            },
            {
              key: 'originalPrice',
              label: 'MRP',
              render: (row) => formatMoney(row.originalPrice),
            },
            {
              key: 'reviewCount',
              label: 'Reviews',
              render: (row) => row.reviewCount ?? 0,
            },
          ]}
          emptyMessage="No products matched your current search."
          rows={searchedProductCatalog.slice(0, 12)}
          subtitle="Search bar top navbar se linked hai. Yahan current filtered catalog dikhega."
          title="Catalog Preview"
        />

        <AdminSectionCard
          title="Product Manager"
          subtitle="Yahin se product add ke baad direct edit, remove aur storefront sync control karo."
        >
          <div className="admin-stack">
            {searchedProductCatalog.map((product) => (
              <article className="admin-repeat-card" key={product.id}>
                <div className="admin-repeat-card__header">
                  <strong>{product.name}</strong>
                  <button
                    className="admin-text-button is-danger"
                    onClick={() => removeProduct(product.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>

                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Product ID"
                    onChange={(event) => updateProductField(product.id, 'id', event.target.value)}
                    value={product.id ?? ''}
                  />
                  <AdminInput
                    label="Product Name"
                    onChange={(event) => updateProductField(product.id, 'name', event.target.value)}
                    value={product.name ?? ''}
                  />
                  <AdminInput
                    label="Category"
                    onChange={(event) => updateProductField(product.id, 'category', event.target.value)}
                    value={product.category ?? ''}
                  />
                  <AdminInput
                    label="Selling Price"
                    onChange={(event) => updateProductField(product.id, 'price', Number(event.target.value) || 0)}
                    value={product.price ?? 0}
                  />
                  <AdminInput
                    label="Original Price"
                    onChange={(event) =>
                      updateProductField(product.id, 'originalPrice', Number(event.target.value) || 0)
                    }
                    value={product.originalPrice ?? 0}
                  />
                  <AdminInput
                    label="Image Path / URL"
                    onChange={(event) => updateProductField(product.id, 'image', event.target.value)}
                    value={product.image ?? ''}
                  />
                </div>

                <AdminTextarea
                  label="Short Summary"
                  onChange={(event) => updateProductField(product.id, 'summary', event.target.value)}
                  rows={3}
                  value={product.summary ?? ''}
                />
              </article>
            ))}
          </div>
        </AdminSectionCard>
      </>
    )
  }

  function renderFeaturedProductsCard() {
    return (
      <AdminSectionCard
        title="Featured Homepage Sections"
        subtitle="Homepage ke featured product blocks aur unke product ids yahan se manage karo."
      >
        <div className="admin-stack">
          {featuredSections.map((section, index) => (
            <article className="admin-repeat-card" key={section.id || index}>
              <div className="admin-repeat-card__header">
                <strong>Section {index + 1}</strong>
              </div>

              <div className="admin-grid admin-grid--two">
                <AdminInput
                  label="Section ID"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.sections = updateArrayItem(
                        nextDraft.sections,
                        index,
                        'id',
                        event.target.value,
                      )
                    })
                  }
                  value={section.id ?? ''}
                />
                <AdminInput
                  label="Accent"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.sections = updateArrayItem(
                        nextDraft.sections,
                        index,
                        'accent',
                        event.target.value,
                      )
                    })
                  }
                  value={section.accent ?? ''}
                />
                <AdminInput
                  label="Section Title"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.sections = updateArrayItem(
                        nextDraft.sections,
                        index,
                        'title',
                        event.target.value,
                      )
                    })
                  }
                  value={section.title ?? ''}
                />
              </div>

              <AdminTextarea
                hint="Har line me ek existing product id likho. Sirf matching ids hi section me use hongi."
                label="Featured Product IDs"
                onChange={(event) =>
                  updateDraft((nextDraft) => {
                    const productMap = new Map(
                      (nextDraft.shop.products ?? []).map((product) => [product.id, product]),
                    )
                    const nextProducts = event.target.value
                      .split('\n')
                      .map((value) => value.trim())
                      .filter(Boolean)
                      .map((productId) => productMap.get(productId))
                      .filter(Boolean)

                    nextDraft.sections = nextDraft.sections.map((currentSection, sectionIndex) =>
                      sectionIndex === index
                        ? {
                            ...currentSection,
                            products: nextProducts,
                          }
                        : currentSection,
                    )
                  })
                }
                rows={6}
                value={(section.products ?? []).map((product) => product.id).join('\n')}
              />
            </article>
          ))}
        </div>
      </AdminSectionCard>
    )
  }

  function renderOfferBannerCard() {
    return (
      <>
        <AdminSectionCard
          title="Offer Banner & Promo Strip"
          subtitle="Promo note, offer highlight aur service delivery banner content yahan se manage karo."
        >
          <div className="admin-grid admin-grid--two">
            <AdminInput
              label="Promo Note"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.promoBar.note = event.target.value
                })
              }
              value={draft?.promoBar?.note ?? ''}
            />
            <AdminInput
              label="Promo Highlight"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.promoBar.highlight = event.target.value
                })
              }
              value={draft?.promoBar?.highlight ?? ''}
            />
            <AdminInput
              label="Delivery Banner Title"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.serviceBanner.title = event.target.value
                })
              }
              value={draft?.serviceBanner?.title ?? ''}
            />
            <AdminInput
              label="Delivery Banner Subtitle"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.serviceBanner.subtitle = event.target.value
                })
              }
              value={draft?.serviceBanner?.subtitle ?? ''}
            />
            <AdminInput
              label="Delivery Seal"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.serviceBanner.seal = event.target.value
                })
              }
              value={draft?.serviceBanner?.seal ?? ''}
            />
            <AdminInput
              label="CTA Label"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.serviceBanner.ctaLabel = event.target.value
                })
              }
              value={draft?.serviceBanner?.ctaLabel ?? ''}
            />
          </div>
        </AdminSectionCard>

        <AdminDataTable
          columns={[
            { key: 'id', label: 'Banner ID' },
            { key: 'title', label: 'Title' },
            { key: 'subtitle', label: 'Subtitle' },
            { key: 'alt', label: 'Alt Text' },
          ]}
          emptyMessage="No banners available."
          rows={heroSlides}
          subtitle="Current hero slides reference list."
          title="Hero Slides Reference"
        />
      </>
    )
  }

  function renderAllBannersPage() {
    return (
      <>
        <div className="admin-banner-grid">
          {heroSlides.map((slide) => (
            <article className="admin-banner-card" key={slide.id}>
              <div className="admin-banner-card__media">
                <img alt={slide.alt ?? slide.title} src={slide.image} />
              </div>
              <div className="admin-banner-card__body">
                <strong>{slide.title}</strong>
                <span>{slide.subtitle}</span>
                <p>{slide.alt}</p>
              </div>
            </article>
          ))}
        </div>

        {renderHeroBannerCard({
          allowAdd: false,
          title: 'Edit Existing Banners',
          subtitle: 'Use this area to polish current banner copy and images.',
        })}
      </>
    )
  }

  function renderOrdersPage() {
    let rows = workspaceData.orders

    if (activeView === 'orders-pending-orders') {
      rows = rows.filter((order) => order.orderStatus === 'Pending')
    } else if (activeView === 'orders-packed-orders') {
      rows = rows.filter((order) => order.orderStatus === 'Packed')
    } else if (activeView === 'orders-shipped-orders') {
      rows = rows.filter((order) => order.orderStatus === 'Shipped')
    } else if (activeView === 'orders-delivered-orders') {
      rows = rows.filter((order) => order.orderStatus === 'Delivered')
    } else if (activeView === 'orders-cancelled-orders') {
      rows = rows.filter((order) => order.orderStatus === 'Cancelled')
    } else if (activeView === 'orders-return-refund') {
      rows = rows.filter((order) => order.paymentStatus === 'Refunded')
    }

    rows = rows.filter((row) => matchesSearch(row, searchQuery))

    return (
      <>
        <div className="admin-shell-metric-grid">
          <AdminMetricTile
            icon={BagIcon}
            label="Total Orders"
            note="Live checkout orders from storefront"
            tone="forest"
            value={workspaceData.orders.length}
          />
          <AdminMetricTile
            icon={TruckIcon}
            label="Ready To Ship"
            note="Packed + shipped orders"
            tone="sky"
            value={workspaceData.orders.filter((order) => ['Packed', 'Shipped'].includes(order.orderStatus)).length}
          />
          <AdminMetricTile
            icon={WalletIcon}
            label="Refund Cases"
            note="Needs review or reversal"
            tone="rose"
            value={workspaceData.orders.filter((order) => order.paymentStatus === 'Refunded').length}
          />
        </div>

        <AdminDataTable
          columns={[
            { key: 'id', label: 'Order ID' },
            { key: 'customer', label: 'Customer' },
            { key: 'product', label: 'Product' },
            { key: 'quantity', label: 'Qty' },
            { key: 'total', label: 'Amount' },
            {
              key: 'paymentStatus',
              label: 'Payment',
              render: (row) => (
                <span className={`admin-status admin-status--payment-${slugifyValue(row.paymentStatus)}`}>
                  {row.paymentStatus}
                </span>
              ),
            },
            {
              key: 'orderStatus',
              label: 'Order Status',
              render: (row) => (
                <span className={`admin-status admin-status--order-${slugifyValue(row.orderStatus)}`}>
                  {row.orderStatus}
                </span>
              ),
            },
            { key: 'date', label: 'Date' },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="admin-table__actions">
                  <select
                    className="admin-table__select"
                    onChange={(event) => updateOrderField(row.id, 'orderStatus', event.target.value)}
                    value={row.orderStatus}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <select
                    className="admin-table__select"
                    onChange={(event) => updateOrderField(row.id, 'paymentStatus', event.target.value)}
                    value={row.paymentStatus}
                  >
                    <option value="Paid">Paid</option>
                    <option value="COD">COD</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                  <button className="admin-table__action is-danger" onClick={() => removeOrder(row.id)} type="button">
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          emptyMessage="No orders matched this filter."
          rows={rows}
          subtitle={activeMenuItem.description}
          title={activeMenuItem.label}
        />
      </>
    )
  }

  function renderInventoryPage() {
    let rows = workspaceData.inventory

    if (activeView === 'inventory-low-stock') {
      rows = rows.filter((item) => item.status === 'Low Stock')
    } else if (activeView === 'inventory-out-of-stock') {
      rows = rows.filter((item) => item.status === 'Out of Stock')
    } else if (activeView === 'inventory-expiring-soon') {
      rows = rows.filter((item) => item.status === 'Expiring Soon')
    } else if (activeView === 'inventory-expired-products') {
      rows = rows.filter((item) => item.status === 'Expired')
    }

    rows = rows.filter((row) => matchesSearch(row, searchQuery))

    return (
      <>
        <div className="admin-shell-metric-grid">
          <AdminMetricTile
            icon={PackageIcon}
            label="Tracked Products"
            note="Inventory sample from current catalog"
            tone="leaf"
            value={workspaceData.inventory.length}
          />
          <AdminMetricTile
            icon={SparkIcon}
            label="Low Stock"
            note="Needs purchase or refill"
            tone="amber"
            value={workspaceData.inventory.filter((item) => item.status === 'Low Stock').length}
          />
          <AdminMetricTile
            icon={ShieldCheckIcon}
            label="Healthy Stock"
            note="Products in safe range"
            tone="mint"
            value={workspaceData.inventory.filter((item) => item.status === 'Healthy').length}
          />
        </div>

        <AdminDataTable
          columns={[
            { key: 'product', label: 'Product' },
            { key: 'category', label: 'Category' },
            { key: 'sku', label: 'SKU' },
            { key: 'stock', label: 'Stock' },
            { key: 'expiryDate', label: 'Expiry' },
            {
              key: 'status',
              label: 'Status',
              render: (row) =>
                row.status === 'Healthy' ? (
                  <span className="admin-stock-pill admin-stock-pill--in-stock">Healthy</span>
                ) : (
                  <span className={`admin-status admin-status--alert-${slugifyValue(row.status)}`}>
                    {row.status}
                  </span>
                ),
            },
          ]}
          emptyMessage="No inventory item matched this filter."
          rows={rows}
          subtitle={activeMenuItem.description}
          title={activeMenuItem.label}
        />
      </>
    )
  }

  function renderCustomersPage() {
    let rows = workspaceData.customers

    if (activeView === 'customers-new-customers') {
      rows = rows.filter((item) => item.status === 'New')
    } else if (activeView === 'customers-blocked-customers') {
      rows = rows.filter((item) => item.status === 'Blocked')
    }

    rows = rows.filter((row) => matchesSearch(row, searchQuery))

    return (
      <>
        <div className="admin-shell-metric-grid">
          <AdminMetricTile
            icon={UserIcon}
            label="Customer Base"
            note="Signup and checkout customers"
            tone="teal"
            value={workspaceData.customers.length}
          />
          <AdminMetricTile
            icon={PlusIcon}
            label="New Customers"
            note="Recently joined users"
            tone="mint"
            value={workspaceData.customers.filter((item) => item.status === 'New').length}
          />
          <AdminMetricTile
            icon={LockIcon}
            label="Blocked"
            note="Spam or verification failures"
            tone="rose"
            value={workspaceData.customers.filter((item) => item.status === 'Blocked').length}
          />
        </div>

        <AdminDataTable
          columns={[
            { key: 'id', label: 'Customer ID' },
            { key: 'name', label: 'Name' },
            { key: 'joined', label: 'Joined' },
            { key: 'orders', label: 'Orders' },
            { key: 'spend', label: 'Spend' },
            {
              key: 'segment',
              label: 'Segment',
              render: (row) => renderToneBadge(row.segment),
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => renderToneBadge(row.status),
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="admin-table__actions">
                  {row.source === 'registered' ? (
                    <button
                      className="admin-table__action"
                      onClick={() =>
                        updateCustomerStatus(
                          row.id,
                          String(row.status).toLowerCase() === 'blocked' ? 'Active' : 'Blocked',
                        )
                      }
                      type="button"
                    >
                      {String(row.status).toLowerCase() === 'blocked' ? 'Unblock' : 'Block'}
                    </button>
                  ) : (
                    <span className="admin-status admin-status--alert-expiring-soon">Guest</span>
                  )}
                  <button
                    className="admin-table__action is-danger"
                    onClick={() =>
                      row.source === 'registered'
                        ? removeCustomer(row.id)
                        : removeGuestCustomer(row.customerKey, row.name)
                    }
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          emptyMessage="No customer matched this filter."
          rows={rows}
          subtitle={activeMenuItem.description}
          title={activeMenuItem.label}
        />
      </>
    )
  }

  function renderPaymentsPage() {
    let rows = workspaceData.payments

    if (activeView === 'payments-paid-orders') {
      rows = rows.filter((item) => item.status === 'Paid')
    } else if (activeView === 'payments-cod-orders') {
      rows = rows.filter((item) => item.status === 'COD')
    } else if (activeView === 'payments-failed-payments') {
      rows = rows.filter((item) => item.status === 'Failed')
    } else if (activeView === 'payments-refunds') {
      rows = rows.filter((item) => item.status === 'Refunded')
    }

    rows = rows.filter((row) => matchesSearch(row, searchQuery))

    return (
      <>
        <div className="admin-shell-metric-grid">
          <AdminMetricTile
            icon={WalletIcon}
            label="Payment Logs"
            note="Live payment records tied to checkout"
            tone="premium"
            value={workspaceData.payments.length}
          />
          <AdminMetricTile
            icon={ShieldCheckIcon}
            label="Paid Orders"
            note="Completed online payments"
            tone="mint"
            value={workspaceData.payments.filter((item) => item.status === 'Paid').length}
          />
          <AdminMetricTile
            icon={RefreshIcon}
            label="Refunds"
            note="Refunded or reversed payments"
            tone="rose"
            value={workspaceData.payments.filter((item) => item.status === 'Refunded').length}
          />
        </div>

        <AdminDataTable
          columns={[
            { key: 'id', label: 'Payment ID' },
            { key: 'orderId', label: 'Order ID' },
            { key: 'customer', label: 'Customer' },
            { key: 'amount', label: 'Amount' },
            { key: 'method', label: 'Method' },
            {
              key: 'status',
              label: 'Status',
              render: (row) => renderToneBadge(row.status),
            },
            { key: 'date', label: 'Date' },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="admin-table__actions">
                  <select
                    className="admin-table__select"
                    onChange={(event) => updateOrderField(row.orderId, 'paymentStatus', event.target.value)}
                    value={row.status}
                  >
                    <option value="Paid">Paid</option>
                    <option value="COD">COD</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              ),
            },
          ]}
          emptyMessage="No payment matched this filter."
          rows={rows}
          subtitle={activeMenuItem.description}
          title={activeMenuItem.label}
        />
      </>
    )
  }

  function renderCouponsPage() {
    let rows = couponEntries

    if (activeView === 'coupons-active-offers') {
      rows = rows.filter((item) => item.status === 'Active')
    } else if (activeView === 'coupons-expired-offers') {
      rows = rows.filter((item) => item.status === 'Expired')
    }

    rows = rows.filter((row) => matchesSearch(row, searchQuery))

    return (
      <>
        {activeView === 'coupons-add-coupon' ? (
          <AdminSectionCard
            title="Create Coupon"
            subtitle="Dummy/static offer data ke liye quick coupon draft form."
          >
            <div className="admin-grid admin-grid--two">
              <AdminInput
                label="Coupon Code"
                onChange={(event) =>
                  setCouponForm((currentValue) => ({ ...currentValue, code: event.target.value }))
                }
                value={couponForm.code}
              />
              <AdminInput
                label="Discount (%)"
                onChange={(event) =>
                  setCouponForm((currentValue) => ({
                    ...currentValue,
                    discount: event.target.value,
                  }))
                }
                value={couponForm.discount}
              />
              <AdminInput
                label="Description"
                onChange={(event) =>
                  setCouponForm((currentValue) => ({
                    ...currentValue,
                    description: event.target.value,
                  }))
                }
                value={couponForm.description}
              />
              <AdminInput
                label="Expiry Date"
                onChange={(event) =>
                  setCouponForm((currentValue) => ({
                    ...currentValue,
                    expiresOn: event.target.value,
                  }))
                }
                type="date"
                value={couponForm.expiresOn}
              />
            </div>

            <button className="admin-button admin-button--primary" onClick={handleAddCoupon} type="button">
              Add Coupon Draft
            </button>
          </AdminSectionCard>
        ) : null}

        <AdminDataTable
          columns={[
            { key: 'code', label: 'Code' },
            { key: 'discount', label: 'Discount' },
            { key: 'description', label: 'Description' },
            { key: 'expiresOn', label: 'Expires On' },
            {
              key: 'status',
              label: 'Status',
              render: (row) => renderToneBadge(row.status),
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="admin-table__actions">
                  <button
                    className="admin-table__action"
                    onClick={() =>
                      updateDraft((nextDraft) => {
                        const nextCoupons =
                          Array.isArray(nextDraft.coupons) && nextDraft.coupons.length > 0
                            ? nextDraft.coupons
                            : createDefaultCoupons()

                        nextDraft.coupons = nextCoupons.map((coupon) =>
                          coupon.id === row.id
                            ? {
                                ...coupon,
                                status: coupon.status === 'Active' ? 'Expired' : 'Active',
                              }
                            : coupon,
                        )
                      })
                    }
                    type="button"
                  >
                    {row.status === 'Active' ? 'Expire' : 'Activate'}
                  </button>
                  <button
                    className="admin-table__action is-danger"
                    onClick={() => removeCoupon(couponEntries.findIndex((coupon) => coupon.id === row.id))}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          emptyMessage="No coupon matched this filter."
          rows={rows}
          subtitle={activeMenuItem.description}
          title={activeMenuItem.label}
        />

        <AdminSectionCard
          title="Coupon Manager"
          subtitle="Coupon codes storefront cart aur checkout dono me live use honge."
        >
          <div className="admin-stack">
            {couponEntries.map((coupon, index) => (
              <article className="admin-repeat-card" key={coupon.id || index}>
                <div className="admin-repeat-card__header">
                  <strong>{coupon.code}</strong>
                  <button className="admin-text-button is-danger" onClick={() => removeCoupon(index)} type="button">
                    Remove
                  </button>
                </div>

                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Coupon Code"
                    onChange={(event) => updateCouponField(index, 'code', event.target.value.toUpperCase())}
                    value={coupon.code ?? ''}
                  />
                  <AdminInput
                    label="Discount"
                    onChange={(event) => updateCouponField(index, 'discount', event.target.value)}
                    value={coupon.discount ?? ''}
                  />
                  <AdminInput
                    label="Description"
                    onChange={(event) => updateCouponField(index, 'description', event.target.value)}
                    value={coupon.description ?? ''}
                  />
                  <AdminInput
                    label="Expires On"
                    onChange={(event) => updateCouponField(index, 'expiresOn', event.target.value)}
                    value={coupon.expiresOn ?? ''}
                  />
                  <AdminInput
                    label="Status"
                    onChange={(event) => updateCouponField(index, 'status', event.target.value)}
                    value={coupon.status ?? ''}
                  />
                </div>
              </article>
            ))}
          </div>
        </AdminSectionCard>
      </>
    )
  }

  function renderReviewsPage() {
    let rows = workspaceData.reviews

    if (activeView === 'reviews-pending-reviews') {
      rows = rows.filter((item) => item.status === 'Pending')
    } else if (activeView === 'reviews-approved-reviews') {
      rows = rows.filter((item) => item.status === 'Approved')
    } else if (activeView === 'reviews-rejected-reviews') {
      rows = rows.filter((item) => item.status === 'Rejected')
    }

    rows = rows.filter((row) => matchesSearch(row, searchQuery))

    return (
      <AdminDataTable
        columns={[
          { key: 'customer', label: 'Customer' },
          { key: 'product', label: 'Product' },
          { key: 'rating', label: 'Rating' },
          { key: 'comment', label: 'Comment' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => renderToneBadge(row.status),
          },
          { key: 'date', label: 'Date' },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="admin-table__actions">
                <button className="admin-table__action" onClick={() => updateReviewStatus(row.id, 'Approved')} type="button">
                  Approve
                </button>
                <button className="admin-table__action" onClick={() => updateReviewStatus(row.id, 'Rejected')} type="button">
                  Reject
                </button>
                <button className="admin-table__action is-danger" onClick={() => removeReview(row.id)} type="button">
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        emptyMessage="No review matched this filter."
        rows={rows}
        subtitle={activeMenuItem.description}
        title={activeMenuItem.label}
      />
    )
  }

  function renderPaymentSettingsPage() {
    return (
      <>
        <AdminSectionCard
          title="Payment Method Labels"
          subtitle="Footer payment logos ke labels aur image paths yahan update karo."
        >
          <div className="admin-stack">
            {paymentEntries.map((payment, index) => (
              <article className="admin-repeat-card" key={payment.id || index}>
                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Payment ID"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.footer.payments = updateArrayItem(
                          nextDraft.footer.payments,
                          index,
                          'id',
                          event.target.value,
                        )
                      })
                    }
                    value={payment.id ?? ''}
                  />
                  <AdminInput
                    label="Label"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.footer.payments = updateArrayItem(
                          nextDraft.footer.payments,
                          index,
                          'label',
                          event.target.value,
                        )
                      })
                    }
                    value={payment.label ?? ''}
                  />
                </div>

                <AdminInput
                  label="Image Path / URL"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.footer.payments = updateArrayItem(
                        nextDraft.footer.payments,
                        index,
                        'image',
                        event.target.value,
                      )
                    })
                  }
                  value={payment.image ?? ''}
                />
              </article>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Checkout Trust Badges"
          subtitle="Homepage trust badges ke labels aur icons yahan se manage karo."
        >
          <div className="admin-stack">
            {trustBadges.map((badge, index) => (
              <article className="admin-repeat-card" key={badge.id || index}>
                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Badge ID"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.trustBadges = updateArrayItem(
                          nextDraft.trustBadges,
                          index,
                          'id',
                          event.target.value,
                        )
                      })
                    }
                    value={badge.id ?? ''}
                  />
                  <AdminInput
                    label="Icon Name"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.trustBadges = updateArrayItem(
                          nextDraft.trustBadges,
                          index,
                          'icon',
                          event.target.value,
                        )
                      })
                    }
                    value={badge.icon ?? ''}
                  />
                  <AdminInput
                    label="Title"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.trustBadges = updateArrayItem(
                          nextDraft.trustBadges,
                          index,
                          'title',
                          event.target.value,
                        )
                      })
                    }
                    value={badge.title ?? ''}
                  />
                  <AdminInput
                    label="Description"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.trustBadges = updateArrayItem(
                          nextDraft.trustBadges,
                          index,
                          'description',
                          event.target.value,
                        )
                      })
                    }
                    value={badge.description ?? ''}
                  />
                </div>
              </article>
            ))}
          </div>
        </AdminSectionCard>
      </>
    )
  }

  function renderDeliverySettingsPage() {
    return (
      <>
        <AdminSectionCard
          title="Delivery Banner"
          subtitle="Delivery section ke copy aur CTA details yahan se update karo."
        >
          <div className="admin-grid admin-grid--two">
            <AdminInput
              label="Delivery Title"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.serviceBanner.title = event.target.value
                })
              }
              value={draft?.serviceBanner?.title ?? ''}
            />
            <AdminInput
              label="Delivery Subtitle"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.serviceBanner.subtitle = event.target.value
                })
              }
              value={draft?.serviceBanner?.subtitle ?? ''}
            />
            <AdminInput
              label="Delivery Seal"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.serviceBanner.seal = event.target.value
                })
              }
              value={draft?.serviceBanner?.seal ?? ''}
            />
            <AdminInput
              label="CTA Label"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.serviceBanner.ctaLabel = event.target.value
                })
              }
              value={draft?.serviceBanner?.ctaLabel ?? ''}
            />
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Support & Dispatch Contact"
          subtitle="Support phone, footer address aur dispatch contact lines."
        >
          <div className="admin-grid admin-grid--two">
            <AdminInput
              label="Promo Phone"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.promoBar.phone = event.target.value
                })
              }
              value={draft?.promoBar?.phone ?? ''}
            />
            <AdminInput
              label="Footer Phone"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.footer.phone = event.target.value
                })
              }
              value={draft?.footer?.phone ?? ''}
            />
            <AdminInput
              label="Footer Address"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  nextDraft.footer.address = event.target.value
                })
              }
              value={draft?.footer?.address ?? ''}
            />
            <AdminInput
              label="Support Email"
              onChange={(event) =>
                updateDraft((nextDraft) => {
                  if (nextDraft.contact.infoBlocks?.[2]) {
                    nextDraft.contact.infoBlocks[2].value = event.target.value
                  }
                })
              }
              value={draft?.contact?.infoBlocks?.[2]?.value ?? ''}
            />
          </div>
        </AdminSectionCard>
      </>
    )
  }

  function renderAdminProfilePage() {
    return (
      <>
        <div className="admin-shell-metric-grid admin-shell-metric-grid--profile">
          <AdminMetricTile
            icon={UserIcon}
            label="Admin Name"
            note={adminSession?.identifier}
            tone="forest"
            value={adminSession?.displayName ?? 'ST Herbal Admin'}
          />
          <AdminMetricTile
            icon={ShieldCheckIcon}
            label="Role"
            note="Access level for current session"
            tone="sky"
            value="Administrator"
          />
          <AdminMetricTile
            icon={LockIcon}
            label="Session Status"
            note="Current secure admin session"
            tone="mint"
            value="Active"
          />
        </div>

        <AdminSectionCard
          title="Profile Controls"
          subtitle="Admin display name aur login email ko yahan se update karo."
        >
          <form className="admin-stack" onSubmit={handleProfileSubmit}>
            <div className="admin-grid admin-grid--two">
              <AdminInput
                label="Admin Display Name"
                onChange={(event) =>
                  setProfileForm((currentValue) => ({
                    ...currentValue,
                    displayName: event.target.value,
                  }))
                }
                value={profileForm.displayName}
              />
              <AdminInput
                label="Admin Login Email"
                onChange={(event) =>
                  setProfileForm((currentValue) => ({
                    ...currentValue,
                    identifier: event.target.value,
                  }))
                }
                value={profileForm.identifier}
              />
            </div>

            <button className="admin-button admin-button--primary" disabled={isProfileSaving} type="submit">
              {isProfileSaving ? 'Saving Profile...' : 'Save Admin Profile'}
            </button>
          </form>
        </AdminSectionCard>
      </>
    )
  }

  function renderTodaySalesPage() {
    return (
      <>
        <div className="admin-shell-metric-grid">
          <AdminMetricTile
            icon={WalletIcon}
            label="Today's Revenue"
            note="Current daily collection"
            tone="premium"
            value={workspaceData.todaySales.revenue}
          />
          <AdminMetricTile
            icon={BagIcon}
            label="Today's Orders"
            note="Orders created today"
            tone="teal"
            value={workspaceData.todaySales.orderCount}
          />
          <AdminMetricTile
            icon={SparkIcon}
            label="Conversion"
            note="Current admin sample conversion"
            tone="amber"
            value={workspaceData.todaySales.conversion}
          />
          <AdminMetricTile
            icon={ShieldCheckIcon}
            label="Average Order Value"
            note="Average basket for today"
            tone="mint"
            value={workspaceData.todaySales.averageOrderValue}
          />
        </div>

        <AdminDataTable
          columns={[
            { key: 'id', label: 'Order ID' },
            { key: 'customer', label: 'Customer' },
            { key: 'product', label: 'Product' },
            { key: 'quantity', label: 'Qty' },
            { key: 'total', label: 'Amount' },
            {
              key: 'paymentStatus',
              label: 'Payment',
              render: (row) => renderToneBadge(row.paymentStatus),
            },
            {
              key: 'orderStatus',
              label: 'Status',
              render: (row) => renderToneBadge(row.orderStatus),
            },
          ]}
          emptyMessage="No orders found for today."
          rows={workspaceData.todayOrders.filter((row) => matchesSearch(row, searchQuery))}
          subtitle="Today ke order entries ka quick performance view."
          title="Today's Order Snapshot"
        />
      </>
    )
  }

  function renderActiveContent() {
    if (activeView === 'overview-dashboard') {
      return <AdminOverview draft={draft} onNavigateSection={navigateFromLegacySection} />
    }

    if (activeView === 'overview-today-sales') {
      return renderTodaySalesPage()
    }

    if (activeView === 'overview-recent-activity') {
      return (
        <>
          <AdminActivityFeed
            items={workspaceData.activity.filter((item) => matchesSearch(item, searchQuery))}
            subtitle="Recent admin actions, alerts aur storefront movements."
            title="Recent Activity Feed"
          />
          <AdminDataTable
            columns={[
              { key: 'customer', label: 'Customer' },
              { key: 'product', label: 'Product' },
              { key: 'rating', label: 'Rating' },
              {
                key: 'status',
                label: 'Moderation',
                render: (row) => renderToneBadge(row.status),
              },
            ]}
            emptyMessage="No review events found."
            rows={workspaceData.reviews.filter((item) => matchesSearch(item, searchQuery)).slice(0, 4)}
            subtitle="Review activity ki quick moderation queue."
            title="Review Activity"
          />
        </>
      )
    }

    if (activeView.startsWith('orders-')) {
      return renderOrdersPage()
    }

    if (activeView === 'products-add-product') {
      return (
        <>
          <AdminSectionCard
            title="Add Product"
            subtitle="Quick add form se draft catalog me naya herbal product push karo."
          >
            <div className="admin-grid admin-grid--two">
              <AdminInput
                label="Product ID"
                onChange={(event) =>
                  setNewProductForm((currentValue) => ({ ...currentValue, id: event.target.value }))
                }
                value={newProductForm.id}
              />
              <AdminInput
                label="Product Name"
                onChange={(event) =>
                  setNewProductForm((currentValue) => ({ ...currentValue, name: event.target.value }))
                }
                value={newProductForm.name}
              />
              <AdminInput
                label="Category"
                onChange={(event) =>
                  setNewProductForm((currentValue) => ({ ...currentValue, category: event.target.value }))
                }
                value={newProductForm.category}
              />
              <AdminInput
                label="Selling Price"
                onChange={(event) =>
                  setNewProductForm((currentValue) => ({ ...currentValue, price: event.target.value }))
                }
                value={newProductForm.price}
              />
              <AdminInput
                label="Original Price"
                onChange={(event) =>
                  setNewProductForm((currentValue) => ({
                    ...currentValue,
                    originalPrice: event.target.value,
                  }))
                }
                value={newProductForm.originalPrice}
              />
              <AdminInput
                label="Image Path / URL"
                onChange={(event) =>
                  setNewProductForm((currentValue) => ({ ...currentValue, image: event.target.value }))
                }
                value={newProductForm.image}
              />
            </div>

            <AdminTextarea
              label="Short Summary"
              onChange={(event) =>
                setNewProductForm((currentValue) => ({ ...currentValue, summary: event.target.value }))
              }
              rows={4}
              value={newProductForm.summary}
            />

            <button className="admin-button admin-button--primary" onClick={handleAddProduct} type="button">
              Add Product To Draft
            </button>
          </AdminSectionCard>

          <AdminDataTable
            columns={[
              { key: 'name', label: 'Product Name' },
              { key: 'category', label: 'Category' },
              {
                key: 'price',
                label: 'Price',
                render: (row) => formatMoney(row.price),
              },
            ]}
            emptyMessage="No product available yet."
            rows={searchedProductCatalog.slice(0, 6)}
            subtitle="Recent products from the current draft catalog."
            title="Recent Catalog Draft"
          />
        </>
      )
    }

    if (activeView === 'products-all-products') {
      return renderShopCatalogCards()
    }

    if (activeView === 'products-product-categories') {
      return renderCategoriesCard()
    }

    if (activeView === 'products-featured-products') {
      return renderFeaturedProductsCard()
    }

    if (activeView.startsWith('inventory-')) {
      return renderInventoryPage()
    }

    if (activeView.startsWith('customers-')) {
      return renderCustomersPage()
    }

    if (activeView.startsWith('payments-')) {
      return renderPaymentsPage()
    }

    if (activeView.startsWith('coupons-')) {
      return renderCouponsPage()
    }

    if (activeView === 'banners-home-banner') {
      return renderHeroBannerCard()
    }

    if (activeView === 'banners-offer-banner') {
      return renderOfferBannerCard()
    }

    if (activeView === 'banners-add-banner') {
      return renderHeroBannerCard({
        allowAdd: true,
        title: 'Add Banner',
        subtitle: 'Add a new homepage banner and configure its slide content.',
      })
    }

    if (activeView === 'banners-all-banners') {
      return renderAllBannersPage()
    }

    if (activeView.startsWith('reviews-')) {
      return renderReviewsPage()
    }

    if (activeView === 'settings-store-details') {
      return (
        <>
          {renderGeneralSettingsCard()}
          {renderHomeExperienceCard()}
          {renderAboutSettingsCard()}
          {renderAboutCollectionsCard()}
          {renderContactSettingsCard()}
          {renderFullJsonCard()}
        </>
      )
    }

    if (activeView === 'settings-admin-profile') {
      return renderAdminProfilePage()
    }

    if (activeView === 'settings-payment-settings') {
      return renderPaymentSettingsPage()
    }

    if (activeView === 'settings-delivery-settings') {
      return renderDeliverySettingsPage()
    }

    if (activeView === 'settings-change-password') {
      return (
        <AdminSectionCard
          title="Change Password"
          subtitle="Current admin login ke liye secure password yahan se update karo."
        >
          <form className="admin-stack" onSubmit={handlePasswordSubmit}>
            <div className="admin-grid admin-grid--two">
              <AdminInput
                label="Current Password"
                name="currentPassword"
                onChange={(event) =>
                  setPasswordForm((currentValue) => ({
                    ...currentValue,
                    currentPassword: event.target.value,
                  }))
                }
                type="password"
                value={passwordForm.currentPassword}
              />
              <AdminInput
                label="New Password"
                name="nextPassword"
                onChange={(event) =>
                  setPasswordForm((currentValue) => ({
                    ...currentValue,
                    nextPassword: event.target.value,
                  }))
                }
                type="password"
                value={passwordForm.nextPassword}
              />
              <AdminInput
                label="Confirm Password"
                name="confirmPassword"
                onChange={(event) =>
                  setPasswordForm((currentValue) => ({
                    ...currentValue,
                    confirmPassword: event.target.value,
                  }))
                }
                type="password"
                value={passwordForm.confirmPassword}
              />
            </div>

            <button className="admin-button admin-button--primary" disabled={isPasswordSaving} type="submit">
              {isPasswordSaving ? 'Updating Password...' : 'Update Admin Password'}
            </button>
          </form>
        </AdminSectionCard>
      )
    }

    return (
      <AdminPlaceholderPage
        subtitle="This section is ready for the next round of admin tools."
        title="Coming Soon"
      />
    )
  }

  return (
    <AdminLayout
      isMobileOpen={isSidebarOpen}
      isSidebarCollapsed={isSidebarCollapsed}
      onOverlayClick={() => setIsSidebarOpen(false)}
      sidebar={
        <AdminSidebar
          activeView={activeView}
          adminSession={adminSession}
          expandedGroups={expandedGroups}
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          onOpenCollapsedGroup={handleOpenCollapsedGroup}
          onLogout={onAdminLogout}
          onNavigate={navigateToView}
          onToggleCollapse={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
          onToggleGroup={handleToggleGroup}
        />
      }
      toolbar={
        <div className="admin-toolbar surface-card">
          <div className="admin-toolbar__copy">
            <strong>{activeMenuItem.groupLabel}</strong>
            <span>{activeMenuItem.description}</span>
          </div>

          <div className="admin-toolbar__actions">
            <a className="admin-button admin-button--outline" href="#/" rel="noreferrer" target="_blank">
              Preview Website
            </a>
            <button className="admin-button admin-button--ghost" onClick={resetToCurrentContent} type="button">
              Reset Draft
            </button>
            <button className="admin-button admin-button--primary" disabled={isSaving} onClick={handleSave} type="button">
              {isSaving ? 'Saving...' : 'Save Website Changes'}
            </button>
          </div>
        </div>
      }
      topbar={
        <AdminTopbar
          activeItem={activeMenuItem}
          adminSession={adminSession}
          notificationCount={workspaceData.activity.length}
          onLogout={onAdminLogout}
          onOpenMobile={() => setIsSidebarOpen(true)}
          onSearchChange={setSearchQuery}
          searchValue={searchQuery}
        />
      }
    >
      {statusMessage ? <div className="admin-form-message is-success">{statusMessage}</div> : null}
      {errorMessage ? <div className="admin-form-message is-error">{errorMessage}</div> : null}

      <div className="admin-content admin-content--shell">{renderActiveContent()}</div>
    </AdminLayout>
  )
}

export { AdminDashboardPage, AdminLoginPage }
