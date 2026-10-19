import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

function formatTimestamp(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function NotificationItem({ notification, onClose }) {
  const { state, dispatch } = useNotifications();
  const { mutate: markAsRead, isPending } = useMutation({
    mutationFn: (notificationId) =>
      apiClient.patch(`/api/notifications/${notificationId}/read`),
    onMutate: (notificationId) => {
      const previousNotifications = state.notifications;
      dispatch({ type: "MARK_READ", payload: notificationId });
      return { previousNotifications };
    },
    onError: (error, _notificationId, context) => {
      console.error("Unable to mark notification as read; restoring state:", error);
      if (context?.previousNotifications) {
        dispatch({
          type: "LOAD_NOTIFICATIONS",
          payload: context.previousNotifications,
        });
      }
    },
  });

  function handleClick() {
    if (!notification.isRead) markAsRead(notification.id);
    onClose?.();
  }

  return (
    <li>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${notification.isRead ? "Read" : "Unread"} notification: ${notification.message}`}
        aria-busy={isPending}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
          padding: "0.9rem 1rem",
          border: 0,
          borderBottom: "1px solid #f3f4f6",
          background: notification.isRead ? "#fff" : "#eff6ff",
          color: "inherit",
          textAlign: "left",
          cursor: "pointer",
          font: "inherit",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            flex: "0 0 8px",
            width: 8,
            height: 8,
            marginTop: "0.35rem",
            borderRadius: "50%",
            background: notification.isRead ? "transparent" : "#3b82f6",
          }}
        />
        <span style={{ minWidth: 0, flex: 1 }}>
          <span
            style={{
              display: "block",
              fontSize: "0.875rem",
              lineHeight: 1.4,
              fontWeight: notification.isRead ? 400 : 600,
            }}
          >
            {notification.message}
          </span>
          <time
            dateTime={notification.createdAt || notification.timestamp}
            style={{ display: "block", marginTop: "0.25rem", color: "#6b7280", fontSize: "0.75rem" }}
          >
            {formatTimestamp(notification.createdAt || notification.timestamp)}
          </time>
        </span>
      </button>
    </li>
  );
}
