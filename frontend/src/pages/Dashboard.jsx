import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ExpenseFeed from '../components/ExpenseFeed';
import NotificationPanel from '../components/NotificationPanel';
import SettlementCard from '../components/SettlementCard';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settlement, setSettlement] = useState(null);
  const [item, setItem] = useState({ itemName: '', quantity: '', amount: '' });
  const [filter, setFilter] = useState({ member: '', startDate: '', endDate: '' });
  const [dark, setDark] = useState(false);

  const params = useMemo(() => Object.fromEntries(Object.entries(filter).filter(([, v]) => v)), [filter]);

  const loadAll = async () => {
    const [exp, mem, note] = await Promise.all([
      api.get('/expenses', { params }),
      api.get('/members'),
      api.get('/notifications')
    ]);
    setExpenses(exp.data);
    setMembers(mem.data);
    setNotifications(note.data);
  };

  useEffect(() => { loadAll(); }, [JSON.stringify(params)]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.emit('group:join', user.group?._id || user.group);
    socket.on('expense:new', (e) => setExpenses((prev) => [e, ...prev]));
    socket.on('notification:new', (n) => {
      setNotifications((prev) => [n, ...prev]);
      toast(n.message);
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const addExpense = async (e) => {
    e.preventDefault();
    await api.post('/expenses', { ...item, amount: Number(item.amount) });
    setItem({ itemName: '', quantity: '', amount: '' });
  };

  const generateSettlement = async () => {
    const { data } = await api.post('/settlements/generate');
    setSettlement(data);
  };

  const downloadPdf = () => {
    if (!settlement?._id) return;
    window.open(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/settlements/${settlement._id}/pdf`, '_blank');
  };

  const addMember = async () => {
    const name = prompt('Member name');
    const email = prompt('Member email');
    const password = prompt('Temporary password');
    if (!name || !email || !password) return;
    await api.post('/members', { name, email, password });
    await loadAll();
  };

  const resetCycle = async () => {
    const newCycleId = prompt('New cycle ID (e.g. May-2026)');
    if (!newCycleId) return;
    await api.post('/admin/reset', { newCycleId });
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl p-3 text-slate-800 dark:text-slate-100">
      <header className="mb-3 flex items-center justify-between rounded-2xl bg-white p-3 shadow dark:bg-slate-800">
        <div>
          <h1 className="text-xl font-bold">MessMates</h1>
          <p className="text-xs text-slate-500">Hi {user.name} ({user.role})</p>
        </div>
        <div className="space-x-2">
          <button className="rounded-lg bg-slate-200 px-2 py-1 text-xs dark:bg-slate-700" onClick={() => setDark((v) => !v)}>🌓</button>
          <button className="rounded-lg bg-red-500 px-3 py-1 text-xs text-white" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
          <form onSubmit={addExpense} className="rounded-2xl bg-white p-3 shadow dark:bg-slate-800 space-y-2">
            <input className="w-full rounded-xl border p-2" placeholder="Item name" value={item.itemName} onChange={(e) => setItem({ ...item, itemName: e.target.value })} required />
            <div className="grid grid-cols-2 gap-2">
              <input className="rounded-xl border p-2" placeholder="Quantity (optional)" value={item.quantity} onChange={(e) => setItem({ ...item, quantity: e.target.value })} />
              <input className="rounded-xl border p-2" placeholder="Amount ₹" type="number" value={item.amount} onChange={(e) => setItem({ ...item, amount: e.target.value })} required />
            </div>
            <button className="w-full rounded-xl bg-brand py-2 text-white">Add Expense</button>
          </form>

          <div className="rounded-2xl bg-white p-3 shadow dark:bg-slate-800 grid grid-cols-3 gap-2">
            <select className="rounded-lg border p-2" onChange={(e) => setFilter({ ...filter, member: e.target.value })}>
              <option value="">All members</option>
              {members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
            <input className="rounded-lg border p-2" type="date" onChange={(e) => setFilter({ ...filter, startDate: e.target.value })} />
            <input className="rounded-lg border p-2" type="date" onChange={(e) => setFilter({ ...filter, endDate: e.target.value })} />
          </div>

          <ExpenseFeed expenses={expenses} />
        </div>
        <div className="space-y-3">
          {user.role === 'admin' && (
            <div className="rounded-2xl bg-white p-3 shadow dark:bg-slate-800 space-y-2">
              <button className="w-full rounded-xl bg-brand py-2 text-white" onClick={generateSettlement}>Generate Settlement</button>
              <button className="w-full rounded-xl bg-emerald-600 py-2 text-white" onClick={downloadPdf}>Download PDF</button>
              <button className="w-full rounded-xl bg-indigo-600 py-2 text-white" onClick={addMember}>Add Member</button>
              <button className="w-full rounded-xl bg-amber-600 py-2 text-white" onClick={resetCycle}>Reset Cycle</button>
            </div>
          )}
          <SettlementCard settlement={settlement} />
          <NotificationPanel notifications={notifications} />
        </div>
      </div>
    </div>
  );
}
