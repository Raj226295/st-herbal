function NotificationPanel({ items }) {
  return (
    <div className="admin-panel-card">
      <div className="admin-section-heading">
        <div>
          <h3>Recent Notifications</h3>
          <p>Store alerts, payments, customer messages and refund updates.</p>
        </div>
      </div>

      <div className="admin-notification-list">
        {items.map((item) => (
          <article className={`admin-notification admin-notification--${item.tone}`} key={item.id}>
            <div className="admin-notification__dot" />
            <div className="admin-notification__body">
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </div>
            <span className="admin-notification__time">{item.time}</span>
          </article>
        ))}
      </div>
    </div>
  )
}

export default NotificationPanel
