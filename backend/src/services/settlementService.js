export const calculateSettlement = (users, expenses) => {
  const byUser = new Map(users.map((u) => [String(u._id), { user: u, spent: 0, net: 0 }]));

  for (const e of expenses) {
    const key = String(e.addedBy._id || e.addedBy);
    if (byUser.has(key)) byUser.get(key).spent += e.amount;
  }

  const totalAmount = expenses.reduce((s, e) => s + e.amount, 0);
  const equalShare = users.length ? totalAmount / users.length : 0;

  const creditors = [];
  const debtors = [];

  for (const entry of byUser.values()) {
    entry.net = +(entry.spent - equalShare).toFixed(2);
    if (entry.net > 0) creditors.push({ ...entry });
    if (entry.net < 0) debtors.push({ ...entry, net: Math.abs(entry.net) });
  }

  creditors.sort((a, b) => b.net - a.net);
  debtors.sort((a, b) => b.net - a.net);

  const transfers = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amount = +Math.min(debtors[i].net, creditors[j].net).toFixed(2);
    if (amount > 0) {
      transfers.push({ from: debtors[i].user, to: creditors[j].user, amount });
      debtors[i].net = +(debtors[i].net - amount).toFixed(2);
      creditors[j].net = +(creditors[j].net - amount).toFixed(2);
    }
    if (debtors[i].net <= 0) i += 1;
    if (creditors[j].net <= 0) j += 1;
  }

  return {
    totalAmount: +totalAmount.toFixed(2),
    equalShare: +equalShare.toFixed(2),
    balances: [...byUser.values()].map((v) => ({ user: v.user, spent: +v.spent.toFixed(2), net: +v.net.toFixed(2) })),
    transfers
  };
};
