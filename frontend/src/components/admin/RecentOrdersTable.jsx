function RecentOrdersTable({ orders }) {
  return (
    <div className="admin-table-card">
      <div className="admin-section-heading">
        <div>
          <h3>Recent Orders</h3>
          <p>Latest herbal orders and fulfilment activity.</p>
        </div>
        <button className="admin-mini-button" type="button">
          View All
        </button>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td>{order.amount}</td>
                <td>
                  <span className={`admin-status admin-status--payment-${order.paymentStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <span className={`admin-status admin-status--order-${order.orderStatus.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>{order.date}</td>
                <td>
                  <button className="admin-table__action" type="button">
                    {order.actionLabel}
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

export default RecentOrdersTable
