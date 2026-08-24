import React from 'react';
import { OrderTimelineItem, OrderStatus } from '../../types';
import { CheckCircle2, Circle, Clock, Truck, Scale, CreditCard, Check } from 'lucide-react';

interface Props {
  timeline: OrderTimelineItem[];
  currentStatus: OrderStatus;
  onAdvanceStatus?: () => void;
  canAdvance?: boolean;
}

export const StatusTimeline: React.FC<Props> = ({
  timeline,
  currentStatus,
  onAdvanceStatus,
  canAdvance = false,
}) => {
  const getStageIcon = (status: OrderStatus, completed: boolean, current: boolean) => {
    const iconClass = current
      ? 'w-5 h-5 text-emerald-600 animate-pulse'
      : completed
      ? 'w-5 h-5 text-emerald-600'
      : 'w-5 h-5 text-slate-300';

    switch (status) {
      case 'posted':
      case 'matched':
      case 'accepted':
        return completed ? <CheckCircle2 className={iconClass} /> : <Circle className={iconClass} />;
      case 'pickup_scheduled':
        return <Truck className={iconClass} />;
      case 'crop_picked_up':
        return <Scale className={iconClass} />;
      case 'payment_completed':
        return <CreditCard className={iconClass} />;
      default:
        return <Circle className={iconClass} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">Order Progress & Status Timeline</h3>
        </div>
        {canAdvance && currentStatus !== 'payment_completed' && (
          <button
            onClick={onAdvanceStatus}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1"
          >
            <span>Simulate Next Step</span>
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-[17px] before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-200">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative flex items-start group">
            {/* Step bullet / Icon */}
            <div
              className={`absolute -left-[30px] top-0.5 rounded-full p-1 border-2 transition-all ${
                item.current
                  ? 'bg-emerald-50 border-emerald-500 shadow-md ring-4 ring-emerald-500/20'
                  : item.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-white border-slate-300 text-slate-300'
              }`}
            >
              {item.completed ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    item.current ? 'bg-emerald-500' : 'bg-transparent'
                  }`}
                />
              )}
            </div>

            {/* Step Content */}
            <div className="ml-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <h4
                  className={`text-sm font-bold ${
                    item.current
                      ? 'text-emerald-700 font-extrabold'
                      : item.completed
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}
                >
                  {item.label} {item.completed && '✓'}
                </h4>
                <span
                  className={`text-xs ${
                    item.completed ? 'text-slate-500 font-medium' : 'text-slate-400 italic'
                  }`}
                >
                  {item.timestamp}
                </span>
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  item.completed ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
