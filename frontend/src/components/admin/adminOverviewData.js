function createSummaryCards(totalProducts) {
  return [
    { id: 'total-orders', title: 'Total Orders', value: '1,284', change: '+12.4%', tone: 'forest', icon: 'orders' },
    { id: 'pending-orders', title: 'Pending Orders', value: '126', change: '+4.8%', tone: 'mint', icon: 'pending' },
    { id: 'completed-orders', title: 'Completed Orders', value: '1,024', change: '+8.9%', tone: 'sky', icon: 'completed' },
    { id: 'cancelled-orders', title: 'Cancelled Orders', value: '38', change: '-1.7%', tone: 'rose', icon: 'cancelled' },
    { id: 'total-revenue', title: 'Total Revenue', value: 'Rs 8.74L', change: '+14.2%', tone: 'gold', icon: 'revenue' },
    { id: 'total-products', title: 'Total Products', value: String(totalProducts), change: '+6 new', tone: 'leaf', icon: 'products' },
    { id: 'low-stock-products', title: 'Low Stock Products', value: '11', change: '+2 alerts', tone: 'amber', icon: 'low-stock' },
    { id: 'total-customers', title: 'Total Customers', value: '3,842', change: '+11.3%', tone: 'teal', icon: 'customers' },
    { id: 'today-orders', title: "Today's Orders", value: '74', change: '+9.1%', tone: 'lime', icon: 'today-orders' },
    { id: 'today-revenue', title: "Today's Revenue", value: 'Rs 28,450', change: '+7.6%', tone: 'premium', icon: 'today-revenue' },
  ]
}

const recentOrders = [
  {
    id: '#ST-2401',
    customerName: 'Riya Sharma',
    productName: 'Ashwagandha Capsules',
    quantity: 2,
    amount: 'Rs 1,198',
    paymentStatus: 'Paid',
    orderStatus: 'Packed',
    date: '12 Jul 2026',
    actionLabel: 'View',
  },
  {
    id: '#ST-2402',
    customerName: 'Aman Verma',
    productName: 'Herbal Immunity Booster',
    quantity: 1,
    amount: 'Rs 699',
    paymentStatus: 'COD',
    orderStatus: 'Pending',
    date: '12 Jul 2026',
    actionLabel: 'Process',
  },
  {
    id: '#ST-2403',
    customerName: 'Neha Gupta',
    productName: 'Aloe Vera Juice',
    quantity: 3,
    amount: 'Rs 1,947',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    date: '11 Jul 2026',
    actionLabel: 'Track',
  },
  {
    id: '#ST-2404',
    customerName: 'Raj Malhotra',
    productName: 'Neem Tablets',
    quantity: 1,
    amount: 'Rs 499',
    paymentStatus: 'Refunded',
    orderStatus: 'Cancelled',
    date: '11 Jul 2026',
    actionLabel: 'Review',
  },
  {
    id: '#ST-2405',
    customerName: 'Pooja Singh',
    productName: 'Herbal Tea',
    quantity: 4,
    amount: 'Rs 1,156',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '10 Jul 2026',
    actionLabel: 'Invoice',
  },
]

const stockAlerts = [
  {
    id: 'alert-1',
    image: '/images/products/giloy-capsules.png',
    productName: 'Herbal Immunity Booster',
    category: 'Immunity Care',
    currentStock: '08 units',
    expiryDate: '29 Aug 2026',
    alertStatus: 'Low Stock',
    actionLabel: 'Restock',
  },
  {
    id: 'alert-2',
    image: '/images/products/neem-capsules.png',
    productName: 'Neem Tablets',
    category: 'Skin Care',
    currentStock: '00 units',
    expiryDate: '18 Sep 2026',
    alertStatus: 'Out of Stock',
    actionLabel: 'Reorder',
  },
  {
    id: 'alert-3',
    image: '/images/products/amla-powder.png',
    productName: 'Amla Powder',
    category: 'Natural Health',
    currentStock: '21 units',
    expiryDate: '05 Aug 2026',
    alertStatus: 'Expiring Soon',
    actionLabel: 'Promote',
  },
  {
    id: 'alert-4',
    image: '/images/products/triphala-powder.png',
    productName: 'Herbal Tea Mix',
    category: 'Detox Care',
    currentStock: '04 units',
    expiryDate: '02 Jul 2026',
    alertStatus: 'Expired',
    actionLabel: 'Remove',
  },
]

const topProducts = [
  {
    id: 'top-1',
    image: '/images/products/giloy-capsules.png',
    name: 'Herbal Immunity Booster',
    soldQuantity: '486 packs',
    revenue: 'Rs 3.42L',
    stockStatus: 'In Stock',
  },
  {
    id: 'top-2',
    image: '/images/products/shilajit-capsules.png',
    name: 'Ashwagandha Capsules',
    soldQuantity: '412 packs',
    revenue: 'Rs 2.96L',
    stockStatus: 'Fast Moving',
  },
  {
    id: 'top-3',
    image: '/images/products/pudina-capsules.png',
    name: 'Aloe Vera Juice',
    soldQuantity: '328 bottles',
    revenue: 'Rs 2.28L',
    stockStatus: 'In Stock',
  },
  {
    id: 'top-4',
    image: '/images/products/neem-capsules.png',
    name: 'Neem Tablets',
    soldQuantity: '290 boxes',
    revenue: 'Rs 1.84L',
    stockStatus: 'Low Stock',
  },
  {
    id: 'top-5',
    image: '/images/products/safed-musli-capsules.png',
    name: 'Hair Growth Oil',
    soldQuantity: '238 bottles',
    revenue: 'Rs 1.62L',
    stockStatus: 'In Stock',
  },
  {
    id: 'top-6',
    image: '/images/products/triphala-powder.png',
    name: 'Herbal Tea',
    soldQuantity: '214 tins',
    revenue: 'Rs 1.27L',
    stockStatus: 'In Stock',
  },
]

const salesSeries = {
  daily: [
    { label: 'Mon', sales: 22, revenue: 14000 },
    { label: 'Tue', sales: 26, revenue: 15800 },
    { label: 'Wed', sales: 24, revenue: 14900 },
    { label: 'Thu', sales: 31, revenue: 18900 },
    { label: 'Fri', sales: 28, revenue: 17500 },
    { label: 'Sat', sales: 36, revenue: 22600 },
    { label: 'Sun', sales: 30, revenue: 19800 },
  ],
  weekly: [
    { label: 'W1', sales: 184, revenue: 124000 },
    { label: 'W2', sales: 206, revenue: 139000 },
    { label: 'W3', sales: 218, revenue: 147000 },
    { label: 'W4', sales: 238, revenue: 163000 },
  ],
  monthly: [
    { label: 'Jan', sales: 842, revenue: 482000 },
    { label: 'Feb', sales: 901, revenue: 516000 },
    { label: 'Mar', sales: 978, revenue: 561000 },
    { label: 'Apr', sales: 1034, revenue: 604000 },
    { label: 'May', sales: 1092, revenue: 648000 },
    { label: 'Jun', sales: 1186, revenue: 701000 },
  ],
}

const customerOverview = [
  { id: 'total-customers', title: 'Total Customers', value: '3,842', note: 'Healthy active buyer base', icon: 'customers' },
  { id: 'new-customers', title: 'New This Month', value: '284', note: 'Strong acquisition from campaigns', icon: 'new' },
  { id: 'repeat-customers', title: 'Repeat Customers', value: '1,462', note: 'Returning buyers trust the brand', icon: 'repeat' },
  { id: 'blocked-customers', title: 'Blocked Customers', value: '16', note: 'Spam or failed verification accounts', icon: 'blocked' },
]

const notifications = [
  { id: 'n1', title: 'New order received', detail: 'Order #ST-2406 placed for Ashwagandha Capsules.', time: '2 min ago', tone: 'success' },
  { id: 'n2', title: 'Payment pending', detail: 'COD confirmation pending for order #ST-2402.', time: '10 min ago', tone: 'warning' },
  { id: 'n3', title: 'Product stock low', detail: 'Herbal Immunity Booster is down to 8 units.', time: '18 min ago', tone: 'alert' },
  { id: 'n4', title: 'Product expiry near', detail: 'Amla Powder batch expires on 05 Aug 2026.', time: '34 min ago', tone: 'warning' },
  { id: 'n5', title: 'Customer message received', detail: 'A customer asked about dosage for Neem Tablets.', time: '49 min ago', tone: 'info' },
  { id: 'n6', title: 'Refund request pending', detail: 'Review refund request for order #ST-2394.', time: '1 hr ago', tone: 'alert' },
]

const quickActions = [
  { id: 'add-product', label: 'Add New Product', icon: 'add' },
  { id: 'manage-orders', label: 'Manage Orders', icon: 'orders' },
  { id: 'manage-customers', label: 'Manage Customers', icon: 'customers' },
  { id: 'add-coupon', label: 'Add Coupon', icon: 'coupon' },
  { id: 'update-banner', label: 'Update Banner', icon: 'banner' },
  { id: 'view-reports', label: 'View Reports', icon: 'reports' },
  { id: 'manage-categories', label: 'Manage Categories', icon: 'categories' },
]

function buildAdminOverviewData(draft) {
  const totalProducts = Array.isArray(draft?.shop?.products) ? draft.shop.products.length : 0

  return {
    summaryCards: createSummaryCards(totalProducts),
    recentOrders,
    stockAlerts,
    topProducts,
    salesSeries,
    customerOverview,
    notifications,
    quickActions,
  }
}

export { buildAdminOverviewData }
