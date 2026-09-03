import React from 'react';
import StakeholderDashboard from './StakeholderDashboard';

interface EnterpriseSuiteProps {
  user: any;
  token?: string | null;
  onBackToDashboard: () => void;
  onNavigate?: (view: string) => void;
}

export default function EnterpriseSuite({ user, token = null, onNavigate }: EnterpriseSuiteProps) {
  const sessionToken = token || (typeof window !== 'undefined' ? localStorage.getItem('rupay_token') : null);

  return (
    <StakeholderDashboard
      user={user}
      token={sessionToken}
      onNavigate={onNavigate}
    />
  );
}
