import { useMemo, useState } from 'react'

const chartRanges = [
  { id: 'daily', label: 'Daily Sales' },
  { id: 'weekly', label: 'Weekly Sales' },
  { id: 'monthly', label: 'Monthly Sales' },
]

function formatCurrency(value) {
  if (value >= 100000) {
    return `Rs ${(value / 100000).toFixed(2)}L`
  }

  if (value >= 1000) {
    return `Rs ${(value / 1000).toFixed(1)}k`
  }

  return `Rs ${value}`
}

function buildChartGeometry(points, width, height, padding) {
  const maxValue = Math.max(...points.map((point) => point.sales), 1)
  const chartHeight = height - padding.top - padding.bottom
  const chartWidth = width - padding.left - padding.right
  const step = points.length > 1 ? chartWidth / (points.length - 1) : 0

  const mappedPoints = points.map((point, index) => {
    const x = padding.left + step * index
    const y = padding.top + chartHeight - (point.sales / maxValue) * chartHeight

    return {
      ...point,
      x,
      y,
    }
  })

  const linePath = mappedPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const firstPoint = mappedPoints[0]
  const lastPoint = mappedPoints[mappedPoints.length - 1]
  const areaPath = `${linePath} L ${lastPoint?.x ?? padding.left} ${height - padding.bottom} L ${firstPoint?.x ?? padding.left} ${height - padding.bottom} Z`

  return {
    mappedPoints,
    maxValue,
    linePath,
    areaPath,
  }
}

function SalesChart({ series }) {
  const [activeRange, setActiveRange] = useState('daily')
  const activeSeries = series[activeRange] ?? []

  const totalSales = activeSeries.reduce((sum, item) => sum + item.sales, 0)
  const totalRevenue = activeSeries.reduce((sum, item) => sum + item.revenue, 0)
  const firstRevenue = activeSeries[0]?.revenue ?? 0
  const lastRevenue = activeSeries[activeSeries.length - 1]?.revenue ?? 0
  const revenueChange = firstRevenue > 0 ? ((lastRevenue - firstRevenue) / firstRevenue) * 100 : 0

  const chart = useMemo(
    () =>
      buildChartGeometry(activeSeries, 640, 280, {
        top: 24,
        right: 20,
        bottom: 30,
        left: 20,
      }),
    [activeSeries],
  )

  return (
    <div className="admin-panel-card admin-sales-card">
      <div className="admin-section-heading">
        <div>
          <h3>Sales Overview</h3>
          <p>Track herbal product demand, revenue movement and store growth.</p>
        </div>

        <div className="admin-sales-card__tabs">
          {chartRanges.map((range) => (
            <button
              className={`admin-sales-card__tab ${activeRange === range.id ? 'is-active' : ''}`}
              key={range.id}
              onClick={() => setActiveRange(range.id)}
              type="button"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-sales-card__summary">
        <article>
          <span>Total Sales</span>
          <strong>{totalSales}</strong>
        </article>
        <article>
          <span>Total Revenue</span>
          <strong>{formatCurrency(totalRevenue)}</strong>
        </article>
        <article>
          <span>Revenue Comparison</span>
          <strong className={revenueChange >= 0 ? 'is-positive' : 'is-negative'}>
            {revenueChange >= 0 ? '+' : ''}
            {revenueChange.toFixed(1)}%
          </strong>
        </article>
      </div>

      <div className="admin-sales-card__chart-shell">
        <svg className="admin-sales-card__chart" viewBox="0 0 640 280" aria-hidden="true">
          <defs>
            <linearGradient id="adminSalesArea" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#43c464" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#43c464" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((index) => {
            const y = 34 + index * 54

            return (
              <line
                key={index}
                x1="20"
                x2="620"
                y1={y}
                y2={y}
                stroke="rgba(22, 88, 52, 0.1)"
                strokeDasharray="6 8"
              />
            )
          })}

          <path d={chart.areaPath} fill="url(#adminSalesArea)" />
          <path
            d={chart.linePath}
            fill="none"
            stroke="#188e4c"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />

          {chart.mappedPoints.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} fill="#ffffff" r="8" />
              <circle cx={point.x} cy={point.y} fill="#188e4c" r="4.5" />
            </g>
          ))}
        </svg>

        <div className="admin-sales-card__axis">
          {activeSeries.map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
        </div>
      </div>

      <div className="admin-sales-card__legend">
        <div className="admin-sales-card__legend-item">
          <span className="admin-sales-card__legend-dot" />
          <span>Order volume trend</span>
        </div>
        <div className="admin-sales-card__legend-item">
          <strong>Revenue:</strong>
          <span>{formatCurrency(lastRevenue)}</span>
        </div>
        <div className="admin-sales-card__legend-item">
          <strong>Peak Sales:</strong>
          <span>{chart.maxValue} units</span>
        </div>
      </div>
    </div>
  )
}

export default SalesChart
