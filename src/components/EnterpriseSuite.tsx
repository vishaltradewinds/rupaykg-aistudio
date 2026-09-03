import React from 'react';
import { CCTSCarbonOS } from './CCTSCarbonOS';

interface EnterpriseSuiteProps {
  user: any;
  token?: string | null;
  onBackToDashboard: () => void;
  onNavigate?: (view: string) => void;
  safeFetch?: (url: string, options?: RequestInit) => Promise<Response | null>;
  safeParseJson?: (res: Response | null) => Promise<any>;
}

export default function EnterpriseSuite({ user, token = null, safeFetch, safeParseJson }: EnterpriseSuiteProps) {
  const sessionToken = token || (typeof window !== 'undefined' ? localStorage.getItem('rupay_token') : null);

  const fetcher = safeFetch || (async (url: string, options?: RequestInit) => fetch(url, options));
  const parser = safeParseJson || (async (res: Response | null) => res ? res.json() : null);

  return (
    <CCTSCarbonOS
      user={user}
      token={sessionToken}
      safeFetch={fetcher}
      safeParseJson={parser}
    />
  );
}
