import React from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import {
  Bell,
  CheckCircle2,
  FileText,
  Truck,
  CreditCard,
  ArrowRight,
  CheckCheck,
} from 'lucide-react';

export const BuyerNotifications: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppState();

  const buyerNotifs = notifications.filter(
    (n) => n.recipientRole === 'buyer' || n.recipientRole === 'all'
  );

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'requirement':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'pickup':
        return <Truck className="w-5 h-5 text-teal-600" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">
              Procurement Alerts
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">Notifications</h1>
            <p className="text-blue-100 text-xs mt-1">
              Farmer matches, requirement acceptances, and pickup status updates.
            </p>
          </div>

          <button
            onClick={() => markAllNotificationsAsRead('buyer')}
            className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-blue-300" />
            <span>Mark all read</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-3">
        {buyerNotifs.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markNotificationAsRead(notif.id)}
            className={`rounded-2xl p-4 sm:p-5 border transition-all flex items-start gap-4 ${
              notif.isRead
                ? 'bg-white border-slate-200/80 shadow-xs'
                : 'bg-blue-50/70 border-blue-300 shadow-md ring-1 ring-blue-400/30'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center shrink-0">
              {getNotifIcon(notif.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-sm font-extrabold text-slate-900 truncate">
                  {notif.title}
                </h4>
                <span className="text-[11px] text-slate-400 shrink-0">{notif.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {notif.message}
              </p>

              {notif.actionUrl && (
                <Link
                  to={notif.actionUrl}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        ))}

        {buyerNotifs.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
            <Bell className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Notifications</h3>
            <p className="text-xs text-slate-500">
              You will receive alerts here when farmers accept your requirements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
