import React from 'react';
import StakeholderDashboard from './StakeholderDashboard';

interface EnterpriseSuiteProps {
  user: any;
  token?: string | null;
  onBackToDashboard: () => void;
  onNavigate?: (view: string) => void;
}

export default function EnterpriseSuite({ user, token = null, onNavigate }: EnterpriseSuiteProps) {
  return (
    <StakeholderDashboard
      user={user}
      token={token}
      onNavigate={onNavigate}
    />
  );
}
