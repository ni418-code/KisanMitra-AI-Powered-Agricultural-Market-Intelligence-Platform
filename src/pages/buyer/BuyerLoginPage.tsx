import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Building2, Lock, Phone } from 'lucide-react';

export const BuyerLoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const { loginWithCredentials, registerBuyer } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState({ businessName: '', phone: '', email: '', businessType: 'Wholesale & Retail', location: '', state: 'Andhra Pradesh', password: '', confirmPassword: '' });
  const update = (key: string, value: string) => setData(prev => ({ ...prev, [key]: value }));

  const submitLogin = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setBusy(true); try { const result = await loginWithCredentials(identifier, password, 'buyer'); if (!result.success) setError(result.error || 'Unable to sign in.'); else navigate('/buyer/dashboard'); } finally { setBusy(false); } };
  const submitRegister = async (e: React.FormEvent) => { e.preventDefault(); setError(''); if (data.password.length < 6) return setError('Password must contain at least 6 characters.'); if (data.password !== data.confirmPassword) return setError('Passwords do not match.'); setBusy(true); try { const result = await registerBuyer({ businessName: data.businessName, phone: data.phone, email: data.email, businessType: data.businessType, location: data.location, state: data.state, password: data.password }); if (!result.success) setError(result.error || 'Registration failed.'); else navigate('/buyer/dashboard'); } finally { setBusy(false); } };

  return <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 p-4"><div className="w-full max-w-lg rounded-3xl border border-blue-100 bg-white p-6 sm:p-8 shadow-card">
    <div className="mb-6 text-center"><div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white"><Building2 className="h-7 w-7" /></div><h1 className="text-2xl font-black text-slate-900">{mode === 'login' ? 'Buyer Sign In' : 'Create Buyer Account'}</h1><p className="mt-1 text-sm text-slate-500">Use your own account. No demo buyer is created automatically.</p></div>
    <div className="mb-6 flex rounded-2xl bg-slate-100 p-1"><button onClick={() => setMode('login')} className={`flex-1 rounded-xl py-2.5 text-sm font-bold ${mode === 'login' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>Sign In</button><button onClick={() => setMode('register')} className={`flex-1 rounded-xl py-2.5 text-sm font-bold ${mode === 'register' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>Create Account</button></div>
    {error && <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700"><AlertCircle className="h-4 w-4" />{error}</div>}
    {mode === 'login' ? <form onSubmit={submitLogin} className="space-y-4"><label className="block text-sm font-bold text-slate-700">Phone or email<input value={identifier} onChange={e => setIdentifier(e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3" /></label><label className="block text-sm font-bold text-slate-700">Password<div className="relative mt-1"><Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4" /></div></label><button disabled={busy} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white disabled:opacity-60">{busy ? 'Signing in...' : 'Sign In'}</button></form> : <form onSubmit={submitRegister} className="space-y-4">
      <label className="block text-sm font-bold text-slate-700">Business / buyer name<input value={data.businessName} onChange={e => update('businessName', e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
      <label className="block text-sm font-bold text-slate-700">Phone<div className="relative mt-1"><Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input value={data.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, ''))} required maxLength={10} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4" /></div></label>
      <label className="block text-sm font-bold text-slate-700">Email<input type="email" value={data.email} onChange={e => update('email', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
      <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Business type<input value={data.businessType} onChange={e => update('businessType', e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3" /></label><label className="text-sm font-bold text-slate-700">Location<input value={data.location} onChange={e => update('location', e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3" /></label></div>
      <label className="block text-sm font-bold text-slate-700">State<select value={data.state} onChange={e => update('state', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>Andhra Pradesh</option><option>Telangana</option><option>Karnataka</option><option>Tamil Nadu</option><option>Maharashtra</option></select></label>
      <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Password<input type="password" value={data.password} onChange={e => update('password', e.target.value)} required minLength={6} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3" /></label><label className="text-sm font-bold text-slate-700">Confirm password<input type="password" value={data.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3" /></label></div>
      <button disabled={busy} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white disabled:opacity-60">{busy ? 'Creating account...' : 'Create Buyer Account'}</button></form>}
  </div></div>;
};
