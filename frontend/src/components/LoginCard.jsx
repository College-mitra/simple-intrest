import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginCard() {
  const { login, registerAdmin } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ groupName: '', name: '', email: '', password: '' });

  const submit = async (e) => {
    e.preventDefault();
    if (mode === 'login') await login(form.email, form.password);
    else await registerAdmin(form);
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">MessMates</h1>
      <p className="mb-4 text-sm text-slate-500">Shared expense manager for your mess/lodge</p>
      <form className="space-y-3" onSubmit={submit}>
        {mode === 'register' && (
          <>
            <input className="w-full rounded-xl border p-3" placeholder="Group Name" onChange={(e) => setForm({ ...form, groupName: e.target.value })} required />
            <input className="w-full rounded-xl border p-3" placeholder="Your Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </>
        )}
        <input type="email" className="w-full rounded-xl border p-3" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" className="w-full rounded-xl border p-3" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="w-full rounded-xl bg-brand py-3 text-white">{mode === 'login' ? 'Login' : 'Create Group'}</button>
      </form>
      <button className="mt-4 text-sm text-brand" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'New group? Register admin' : 'Already have account? Login'}
      </button>
    </div>
  );
}
