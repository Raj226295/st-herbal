function StockAlertTable({ alerts }) {
  return (
    <div className="admin-table-card">
      <div className="admin-section-heading">
        <div>
          <h3>Low Stock & Expiry Alerts</h3>
          <p>Monitor stock health and expiry-sensitive inventory.</p>
        </div>
        <button className="admin-mini-button" type="button">
          Manage Inventory
        </button>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-table admin-table--alerts">
          <thead>
            <tr>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Expiry Date</th>
              <th>Alert Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td>
                  <div className="admin-product-cell">
                    <img src={alert.image} alt={alert.productName} />
                  </div>
                </td>
                <td>{alert.productName}</td>
                <td>{alert.category}</td>
                <td>{alert.currentStock}</td>
                <td>{alert.expiryDate}</td>
                <td>
                  <span className={`admin-status admin-status--alert-${alert.alertStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    {alert.alertStatus}
                  </span>
                </td>
                <td>
                  <button className="admin-table__action" type="button">
                    {alert.actionLabel}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StockAlertTable
