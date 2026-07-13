function DashboardCard({ icon: Icon, title, value, change, tone = 'forest' }) {
  return (
    <article className={`admin-stat-card admin-stat-card--${tone}`}>
      <div className="admin-stat-card__icon">
        <Icon />
      </div>

      <div className="admin-stat-card__body">
        <span className="admin-stat-card__title">{title}</span>
        <strong className="admin-stat-card__value">{value}</strong>
      </div>

      <span className="admin-stat-card__change">{change}</span>
    </article>
  )
}

export default DashboardCard
