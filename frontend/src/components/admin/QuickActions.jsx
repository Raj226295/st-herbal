function QuickActions({ actions, iconMap, onAction }) {
  return (
    <div className="admin-panel-card">
      <div className="admin-section-heading">
        <div>
          <h3>Quick Actions</h3>
          <p>Fast shortcuts for everyday store operations.</p>
        </div>
      </div>

      <div className="admin-quick-actions">
        {actions.map((action) => {
          const Icon = iconMap[action.icon]

          return (
            <button
              className="admin-quick-action"
              key={action.id}
              onClick={() => onAction?.(action)}
              type="button"
            >
              <span className="admin-quick-action__icon">{Icon ? <Icon /> : null}</span>
              <span>{action.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
