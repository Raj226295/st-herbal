import { useMemo } from 'react'
import {
  BagIcon,
  BlockedCustomerIcon,
  DeliveryIcon,
  GlowIcon,
  GridIcon,
  LeafIcon,
  NoSideEffectsIcon,
  PlusIcon,
  RepeatCustomersIcon,
  ShieldCheckIcon,
  SparkIcon,
  TruckIcon,
  UserIcon,
  UserPlusIcon,
  WalletIcon,
} from '../Illustrations.jsx'
import { buildAdminOverviewData } from './adminOverviewData.js'
import DashboardCard from './DashboardCard.jsx'
import NotificationPanel from './NotificationPanel.jsx'
import QuickActions from './QuickActions.jsx'
import RecentOrdersTable from './RecentOrdersTable.jsx'
import SalesChart from './SalesChart.jsx'
import StockAlertTable from './StockAlertTable.jsx'
import TopProducts from './TopProducts.jsx'

const summaryIconMap = {
  orders: BagIcon,
  pending: DeliveryIcon,
  completed: ShieldCheckIcon,
  cancelled: NoSideEffectsIcon,
  revenue: WalletIcon,
  products: LeafIcon,
  'low-stock': SparkIcon,
  customers: UserIcon,
  'today-orders': TruckIcon,
  'today-revenue': WalletIcon,
}

const customerIconMap = {
  customers: UserIcon,
  new: UserPlusIcon,
  repeat: RepeatCustomersIcon,
  blocked: BlockedCustomerIcon,
}

const quickActionIconMap = {
  add: PlusIcon,
  orders: BagIcon,
  customers: UserIcon,
  coupon: SparkIcon,
  banner: GlowIcon,
  reports: WalletIcon,
  categories: GridIcon,
}

function CustomerOverview({ items }) {
  return (
    <div className="admin-panel-card">
      <div className="admin-section-heading">
        <div>
          <h3>Customer Overview</h3>
          <p>Snapshot of new, repeat and managed herbal store customers.</p>
        </div>
      </div>

      <div className="admin-customer-grid">
        {items.map((item) => {
          const Icon = customerIconMap[item.icon] ?? UserIcon

          return (
            <article className={`admin-customer-card admin-customer-card--${item.icon}`} key={item.id}>
              <span className={`admin-customer-card__icon admin-customer-card__icon--${item.icon}`}>
                <Icon />
              </span>
              <strong>{item.value}</strong>
              <span>{item.title}</span>
              <p>{item.note}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}

const actionSectionMap = {
  'add-product': 'shop',
  'manage-orders': 'shop',
  'manage-customers': 'general',
  'add-coupon': 'advanced',
  'update-banner': 'hero',
  'view-reports': 'overview',
  'manage-categories': 'categories',
}

function AdminOverview({ draft, onNavigateSection }) {
  const overview = useMemo(() => buildAdminOverviewData(draft), [draft])

  function handleActionClick(action) {
    const nextSection = actionSectionMap[action.id]

    if (nextSection) {
      onNavigateSection?.(nextSection, action.label)
    }
  }

  return (
    <div className="admin-overview">
      <div className="admin-summary-grid">
        {overview.summaryCards.map((card) => (
          <DashboardCard
            change={card.change}
            icon={summaryIconMap[card.icon] ?? LeafIcon}
            key={card.id}
            title={card.title}
            tone={card.tone}
            value={card.value}
          />
        ))}
      </div>

      <div className="admin-overview-layout">
        <div className="admin-overview-main">
          <SalesChart series={overview.salesSeries} />
          <RecentOrdersTable orders={overview.recentOrders} />
        </div>

        <div className="admin-overview-side">
          <CustomerOverview items={overview.customerOverview} />
          <NotificationPanel items={overview.notifications} />
          <QuickActions
            actions={overview.quickActions}
            iconMap={quickActionIconMap}
            onAction={handleActionClick}
          />
        </div>
      </div>

      <StockAlertTable alerts={overview.stockAlerts} />
      <TopProducts products={overview.topProducts} />
    </div>
  )
}

export default AdminOverview
