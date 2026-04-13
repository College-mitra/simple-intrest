export default function NotificationPanel({ notifications }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow dark:bg-slate-800">
      <h3 className="mb-2 font-semibold">Notifications</h3>
      <div className="max-h-60 space-y-2 overflow-y-auto">
        {notifications.map((n) => (
          <p key={n._id} className="rounded-lg bg-slate-100 p-2 text-sm dark:bg-slate-700">
            {n.message}
          </p>
        ))}
      </div>
    </div>
  );
}
