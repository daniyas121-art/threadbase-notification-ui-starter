import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationItem from "./NotificationItem.jsx";

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useNotifications();
  const { notifications, unreadCount } = state;

  return (
    <section
      role="dialog"
      aria-label="Notifications"
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        right: 0,
        width: "min(360px, calc(100vw - 2rem))",
        maxHeight: "min(480px, calc(100vh - 6rem))",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: "#1f2937",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        boxShadow: "0 16px 40px rgba(15, 23, 42, 0.2)",
        zIndex: 50,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "0.9rem 1rem",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>
            Notifications
          </h2>
          <p style={{ margin: "0.2rem 0 0", color: "#6b7280", fontSize: "0.75rem" }}>
            {unreadCount} unread
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "MARK_ALL_READ" })}
          disabled={unreadCount === 0}
          style={{
            padding: 0,
            border: 0,
            background: "none",
            color: unreadCount === 0 ? "#9ca3af" : "#4f46e5",
            font: "inherit",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: unreadCount === 0 ? "default" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Mark all as read
        </button>
      </header>

      {notifications.length > 0 ? (
        <ul
          aria-label="Notification list"
          style={{ margin: 0, padding: 0, overflowY: "auto", listStyle: "none" }}
        >
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
            />
          ))}
        </ul>
      ) : (
        <p style={{ margin: 0, padding: "1.5rem 1rem", color: "#6b7280", fontSize: "0.875rem", textAlign: "center" }}>
          You’re all caught up.
        </p>
      )}
    </section>
  );
}
