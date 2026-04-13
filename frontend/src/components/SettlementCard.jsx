export default function SettlementCard({ settlement }) {
  if (!settlement) return null;
  return (
    <div className="rounded-2xl bg-white p-4 shadow dark:bg-slate-800">
      <h3 className="mb-2 text-lg font-semibold">Settlement Report</h3>
      <p>Total: ₹{settlement.totalAmount} | Equal share: ₹{settlement.equalShare}</p>
      <div className="mt-3 space-y-2">
        {settlement.transfers.map((t, idx) => (
          <p key={idx} className="rounded-xl bg-slate-100 p-2 dark:bg-slate-700">
            {t.from.name} pays ₹{t.amount} to {t.to.name}
          </p>
        ))}
      </div>
    </div>
  );
}
