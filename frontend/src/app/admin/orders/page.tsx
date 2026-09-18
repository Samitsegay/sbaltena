"use client"

import { useEffect, useState } from "react"
import {
  getAdminOrders,
  updateOrderStatus,
} from "@/lib/admin-api"

type OrderItem = {
  id: number
  productName: string
  size: string
  quantity: number
  price: string | number
}

type Order = {
  id: number
  orderNumber: string
  customerName: string
  phone: string
  region?: string | null
  city?: string | null
  subCity?: string | null
  woreda?: string | null
  houseNumber?: string | null
  address?: string | null
  note?: string | null
  status: string
  total: string | number
  createdAt: string
  items: OrderItem[]
}

const statuses = [
  "pending",
  "processing",
  "fulfilled",
  "cancelled",
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadOrders() {
    try {
      setLoading(true)
      setError("")

      const data = await getAdminOrders()
      setOrders(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load orders"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function handleStatusChange(
    orderId: number,
    status: string
  ) {
    try {
      await updateOrderStatus(orderId, status)

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      )

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status,
        })
      }
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update status"
      )
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "pending":
        return "status-pending"

      case "processing":
        return "status-processing"

      case "fulfilled":
        return "status-fulfilled"

      case "cancelled":
        return "status-cancelled"

      default:
        return "status-default"
    }
  }

  if (loading) {
    return (
      <main className="admin-orders-page">
        <div className="orders-loading">
          <div className="orders-loading-spinner" />
          <h2>Loading Orders</h2>
          <p>Please wait while orders are loaded.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="admin-orders-page">

      {/* HEADER */}
      <div className="orders-page-header">

        <div>
          <div className="orders-breadcrumb">
            Admin / Orders
          </div>

          <h1>Orders</h1>

          <p>
            Manage customer orders and delivery information.
          </p>
        </div>

        <button
          type="button"
          className="orders-refresh-button"
          onClick={loadOrders}
        >
          ↻ Refresh
        </button>

      </div>

      {/* ERROR */}
      {error && (
        <div className="orders-error">
          <strong>Something went wrong</strong>
          <span>{error}</span>
        </div>
      )}

      {/* SUMMARY */}
      <div className="orders-summary">

        <div className="orders-summary-card">
          <span className="orders-summary-label">
            Total Orders
          </span>

          <strong>
            {orders.length}
          </strong>
        </div>

        <div className="orders-summary-card">
          <span className="orders-summary-label">
            Pending
          </span>

          <strong>
            {
              orders.filter(
                (order) =>
                  order.status === "pending"
              ).length
            }
          </strong>
        </div>

        <div className="orders-summary-card">
          <span className="orders-summary-label">
            Processing
          </span>

          <strong>
            {
              orders.filter(
                (order) =>
                  order.status === "processing"
              ).length
            }
          </strong>
        </div>

        <div className="orders-summary-card">
          <span className="orders-summary-label">
            Fulfilled
          </span>

          <strong>
            {
              orders.filter(
                (order) =>
                  order.status === "fulfilled"
              ).length
            }
          </strong>
        </div>

      </div>

      {/* ORDERS */}
      {orders.length === 0 ? (

        <div className="orders-empty">

          <div className="orders-empty-icon">
            ▰
          </div>

          <h2>No Orders Yet</h2>

          <p>
            Customer orders will appear here when
            customers place an order.
          </p>

        </div>

      ) : (

        <div className="orders-table-card">

          <div className="orders-table-header">

            <div>
              <h2>Customer Orders</h2>

              <p>
                Click an order to view complete details.
              </p>
            </div>

            <span className="orders-count">
              {orders.length} orders
            </span>

          </div>

          <div className="orders-table-scroll">

            <table className="orders-table">

              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {orders.map((order) => {

                  const itemCount =
                    order.items.reduce(
                      (sum, item) =>
                        sum + item.quantity,
                      0
                    )

                  return (
                    <tr
                      key={order.id}
                      onClick={() =>
                        setSelectedOrder(order)
                      }
                      className="orders-table-row"
                    >

                      <td>
                        <div className="order-number">
                          {order.orderNumber}
                        </div>

                        <span className="order-id">
                          ID #{order.id}
                        </span>
                      </td>

                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">
                            {order.customerName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <strong>
                            {order.customerName}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <span className="phone-cell">
                          {order.phone}
                        </span>
                      </td>

                      <td>
                        <div className="location-cell">

                          <strong>
                            {order.city || "-"}
                          </strong>

                          <span>
                            {order.region || "-"}
                          </span>

                        </div>
                      </td>

                      <td>
                        <strong className="order-total">
                          {Number(
                            order.total
                          ).toFixed(2)}{" "}
                          ETB
                        </strong>
                      </td>

                      <td>
                        <span className="items-badge">
                          {itemCount}
                        </span>
                      </td>

                      <td
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >

                        <select
                          value={order.status}
                          className={`order-status-select ${getStatusClass(
                            order.status
                          )}`}
                          onChange={(event) =>
                            handleStatusChange(
                              order.id,
                              event.target.value
                            )
                          }
                        >

                          {statuses.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status
                                  .charAt(0)
                                  .toUpperCase() +
                                  status.slice(1)}
                              </option>
                            )
                          )}

                        </select>

                      </td>

                      <td>
                        <span className="order-date">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </td>

                    </tr>
                  )
                })}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (

        <div
          className="orders-modal-overlay"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="orders-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}
            <div className="orders-modal-header">

              <div>

                <span className="modal-order-label">
                  Order Details
                </span>

                <h2>
                  {selectedOrder.orderNumber}
                </h2>

                <p>
                  {new Date(
                    selectedOrder.createdAt
                  ).toLocaleString()}
                </p>

              </div>

              <button
                type="button"
                className="orders-modal-close"
                onClick={() =>
                  setSelectedOrder(null)
                }
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* CUSTOMER */}
            <section className="orders-detail-section">

              <h3>Customer Information</h3>

              <div className="orders-detail-cards">

                <div className="orders-detail-card">

                  <span>Name</span>

                  <strong>
                    {selectedOrder.customerName}
                  </strong>

                </div>

                <div className="orders-detail-card">

                  <span>Phone</span>

                  <strong>
                    {selectedOrder.phone}
                  </strong>

                </div>

              </div>

            </section>

            {/* DELIVERY */}
            <section className="orders-detail-section">

              <h3>Delivery Location</h3>

              <div className="orders-address-card">

                <div className="address-detail">
                  <span>Region</span>
                  <strong>
                    {selectedOrder.region || "-"}
                  </strong>
                </div>

                <div className="address-detail">
                  <span>City</span>
                  <strong>
                    {selectedOrder.city || "-"}
                  </strong>
                </div>

                <div className="address-detail">
                  <span>Sub-city / Town</span>
                  <strong>
                    {selectedOrder.subCity || "-"}
                  </strong>
                </div>

                <div className="address-detail">
                  <span>Woreda</span>
                  <strong>
                    {selectedOrder.woreda || "-"}
                  </strong>
                </div>

                <div className="address-detail">
                  <span>House / Building / Office</span>
                  <strong>
                    {selectedOrder.houseNumber || "-"}
                  </strong>
                </div>

                <div className="address-detail">
                  <span>Additional Address</span>
                  <strong>
                    {selectedOrder.address || "-"}
                  </strong>
                </div>

                <div className="address-detail address-detail-full">
                  <span>Delivery Note</span>
                  <strong>
                    {selectedOrder.note || "-"}
                  </strong>
                </div>

              </div>

            </section>

            {/* ITEMS */}
            <section className="orders-detail-section">

              <div className="orders-items-heading">

                <h3>Order Items</h3>

                <span>
                  {selectedOrder.items.reduce(
                    (sum, item) =>
                      sum + item.quantity,
                    0
                  )}{" "}
                  items
                </span>

              </div>

              <div className="orders-items-list">

                {selectedOrder.items.map(
                  (item) => (

                    <div
                      key={item.id}
                      className="orders-item-row"
                    >

                      <div className="orders-item-info">

                        <strong>
                          {item.productName}
                        </strong>

                        <span>
                          Size: {item.size}
                          {" × "}
                          {item.quantity}
                        </span>

                      </div>

                      <div className="orders-item-price">

                        {(
                          Number(item.price) *
                          item.quantity
                        ).toFixed(2)}{" "}
                        ETB

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>

            {/* STATUS */}
            <section className="orders-modal-status">

              <div>

                <span>Order Status</span>

                <select
                  value={selectedOrder.status}
                  className={`order-status-select ${getStatusClass(
                    selectedOrder.status
                  )}`}
                  onChange={(event) =>
                    handleStatusChange(
                      selectedOrder.id,
                      event.target.value
                    )
                  }
                >

                  {statuses.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status
                          .charAt(0)
                          .toUpperCase() +
                          status.slice(1)}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="orders-modal-total">

                <span>Total</span>

                <strong>
                  {Number(
                    selectedOrder.total
                  ).toFixed(2)}{" "}
                  ETB
                </strong>

              </div>

            </section>

          </div>

        </div>

      )}

    </main>
  )
}
