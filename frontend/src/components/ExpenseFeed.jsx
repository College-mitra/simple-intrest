import { motion } from 'framer-motion';

export default function ExpenseFeed({ expenses }) {
  return (
    <div className="space-y-3">
      {expenses.map((e) => (
        <motion.div key={e._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white p-3 shadow dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-800 dark:text-slate-100">{e.addedBy?.name}</p>
            <span className="text-sm text-slate-500">{new Date(e.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300">{e.itemName} {e.quantity ? `(${e.quantity})` : ''}</p>
          <p className="text-lg font-bold text-brand">₹{e.amount}</p>
        </motion.div>
      ))}
    </div>
  );
}
