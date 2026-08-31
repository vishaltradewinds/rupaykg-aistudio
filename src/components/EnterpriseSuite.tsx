import React from 'react';
import { CCTSCarbonOS } from './CCTSCarbonOS';

interface EnterpriseSuiteProps {
  user: any;
  onBackToDashboard: () => void;
}

/**
 * Compatibility shell for the legacy Enterprise Suite route.
 * The former localStorage/in-memory MRV implementation was removed.
 * The canonical enterprise MRV surface is now CCTSCarbonOS.
 */
export default function EnterpriseSuite({ user }: EnterpriseSuiteProps) {
  return (
    <CCTSCarbonOS
      token={null}
      user={user}
      safeFetch={async () => null}
      safeParseJson={async () => null}
    />
  );
}
