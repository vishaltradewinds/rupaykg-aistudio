import React, { useEffect, useState } from 'react';
import { Building2, Sprout } from 'lucide-react';

export type OperatingContext = 'urban' | 'rural';
export const OPERATING_CONTEXT_KEY = 'rupay_operating_context';

const getStoredContext = (): OperatingContext =>
  localStorage.getItem(OPERATING_CONTEXT_KEY) === 'rural' ? 'rural' : 'urban';

export const setOperatingContext = (context: OperatingContext) => {
  localStorage.setItem(OPERATING_CONTEXT_KEY, context);
  window.dispatchEvent(new CustomEvent('rupay:operating-context-change', { detail: context }));
};

interface Props {
  compact?: boolean;
}

export const OperatingContextSelector: React.FC<Props> = ({ compact = false }) => {
  const [context, setContext] = useState<OperatingContext>(getStoredContext);

  useEffect(() => {
    const sync = () => setContext(getStoredContext());
    window.addEventListener('storage', sync);
    window.addEventListener('rupay:operating-context-change', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('rupay:operating-context-change', sync);
    };
  }, []);

  const select = (next: OperatingContext) => {
    setContext(next);
    setOperatingContext(next);
  };

  return (
    <div className={`flex items-center gap-1 rounded-full border border-white/10 bg-black/70 p-1 shadow-xl backdrop-blur-xl ${compact ? '' : 'px-1'}`}>
      <button
        type="button"
        aria-pressed={context === 'urban'}
        onClick={() => select('urban')}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${context === 'urban' ? 'bg-white text-black' : 'text-white/55 hover:text-white'}`}
      >
        <Building2 size={14} /> Urban
      </button>
      <button
        type="button"
        aria-pressed={context === 'rural'}
        onClick={() => select('rural')}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${context === 'rural' ? 'bg-emerald-500 text-black' : 'text-white/55 hover:text-white'}`}
      >
        <Sprout size={14} /> Rural
      </button>
    </div>
  );
};

export default OperatingContextSelector;
