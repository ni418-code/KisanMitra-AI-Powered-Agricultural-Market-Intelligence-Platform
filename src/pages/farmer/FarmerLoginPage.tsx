import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';
import { AlertCircle, Lock, Phone, Sprout, User } from 'lucide-react';

export const FarmerLoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const { loginWithCredentials, registerFarmer } = useAuth();
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState({ name: '', phone: '', village: '', location: '', state: 'Andhra Pradesh', language: 'en' as Language, password: '', confirmPassword: '' });

  const submitLogin = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setBusy(true); try { const result = await loginWithCredentials(mobile, password, 'farmer'); if (!result.success) setError(result.error || 'Unable to sign in.'); else navigate('/farmer/dashboard'); } finally { setBusy(false); } };
  const submitRegister = async (e: React.FormEvent) => { e.preventDefault(); setError(''); if (data.password.length < 6) return setError('Password must contain at least 6 characters.'); if (data.password !== data.confirmPassword) return setError('Passwords do not match.'); setBusy(true); try { const result = await registerFarmer({ name: data.name, phone: data.phone, village: data.village, location: data.location, state: data.state, language: data.language, password: data.password }); if (!result.success) setError(result.error || 'Registration failed.'); else { setLanguage(data.language); navigate('/farmer/dashboard'); } } finally { setBusy(false); } };
  const update = (key: string, value: string) => setData(prev => ({ ...prev, [key]: value }));

  return <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 p-4"><div className="w-full max-w-lg rounded-3xl border border-emerald-100 bg-white p-6 sm:p-8 shadow-card">
    <div className="text-center mb-6"><div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white"><Sprout className="h-8 w-8" /></div><h1 className="text-2xl font-black text-slate-900">{mode === 'login' ? t.farmerLogin : 'Create Farmer Account'}</h1><p className="mt-1 text-sm text-slate-500">Your own Kisan Mitra account. No demo identity.</p></div>
    <div className="mb-6 flex rounded-2xl bg-slate-100 p-1"><button onClick={() => setMode('login')} className={`flex-1 rounded-xl py-2.5 text-sm font-bold ${mode === 'login' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}>Sign In</button><button onClick={() => setMode('register')} className={`flex-1 rounded-xl py-2.5 text-sm font-bold ${mode === 'register' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}>Create Account</button></div>
    {error && <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700"><AlertCircle className="h-4 w-4" />{error}</div>}
    {mode === 'login' ? <form onSubmit={submitLogin} className="space-y-4"><label className="block text-sm font-bold text-slate-700">Mobile number or email<input value={mobile} onChange={e => setMobile(e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="9876543210" /></label><label className="block text-sm font-bold text-slate-700">Password<div className="relative mt-1"><Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4" /></div></label><button disabled={busy} className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white disabled:opacity-60">{busy ? 'Signing in...' : 'Sign In'}</button></form> : <form onSubmit={submitRegister} className="space-y-4">
      <label className="block text-sm font-bold text-slate-700">Full name<div className="relative mt-1"><User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input value={data.name} onChange={e => update('name', e.target.value)} required className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4" /></div></label>
      <label className="block text-sm font-bold text-slate-700">Phone<div className="relative mt-1"><Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input value={data.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, ''))} required maxLength={10} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4" /></div></label>
      <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Village<input value={data.village} onChange={e => update('village', e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3" /></label><label className="text-sm font-bold text-slate-700">District / Location<input value={data.location} onChange={e => update('location', e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3" /></label></div>
      <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">State<select value={data.state} onChange={e => update('state', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>Andhra Pradesh</option><option>Telangana</option><option>Karnataka</option><option>Tamil Nadu</option><option>Maharashtra</option></select></label><label className="text-sm font-bold text-slate-700">Language<select value={data.language} onChange={e => update('language', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option value="en">English</option><option value="te">తెలుగు</option><option value="hi">हिन्दी</option><option value="ta">தமிழ்</option><option value="mr">मराठी</option></select></label></div>
      <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Password<input type="password" value={data.password} onChange={e => update('password', e.target.value)} required minLength={6} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3" /></label><label className="text-sm font-bold text-slate-700">Confirm password<input type="password" value={data.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3" /></label></div>
      <button disabled={busy} className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white disabled:opacity-60">{busy ? 'Creating account...' : 'Create Farmer Account'}</button></form>}
  </div></div>;
};
