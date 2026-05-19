export const logEvent = (action: string, actor: string, metadata: any) => {
  console.log(`[AUDIT] Action: ${action} | Actor: ${actor} | Meta: ${JSON.stringify(metadata)}`);
  // Push to append-only event ledger (e.g. MongoDB collection with no delete/update allowed)
};
