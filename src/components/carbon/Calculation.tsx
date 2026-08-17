import React from 'react';
import { CQECockpit } from './CQECockpit.tsx';

interface CalculationProps {
  token?: string | null;
}

export const Calculation: React.FC<CalculationProps> = ({ token }) => {
  return <CQECockpit token={token} />;
};
