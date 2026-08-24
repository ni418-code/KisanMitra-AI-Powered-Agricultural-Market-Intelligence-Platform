import React from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';

interface Props {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  showIconOnly?: boolean;
}

export const VerifiedBadge: React.FC<Props> = ({
  text = 'Verified',
  size = 'md',
  showIconOnly = false,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
    lg: 'text-sm px-2.5 py-1 gap-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  if (showIconOnly) {
    return (
      <span title="Verified by KisanMitra" className="inline-flex text-emerald-600">
        <CheckCircle className={iconSizes[size]} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full shadow-xs ${sizeClasses[size]}`}
    >
      <ShieldCheck className={`${iconSizes[size]} text-emerald-600`} />
      <span>{text}</span>
    </span>
  );
};
