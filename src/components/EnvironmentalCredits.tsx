import React, { useEffect, useState } from 'react';

type CreditType = 'CCC' | 'GREEN_CREDIT';

interface Position { id: string; credit_type: CreditType; authoritative_registry: string; authoritative_credit_reference: string; issued_quantity: number; available_quantity: number; reserved_quantity: number; tradability_status: string; status: string; }

export default function EnvironmentalCredits() {
  const [type, setType] = useState<CreditType>('CCC');
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/v1/environmental-credits/available?creditType=${type}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Unable to load environmental credit inventory')))
      .then(data => { if (active) setPositions(Array.isArray(data) ? data : []); })
      .catch(() => { if (active) setPositions([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [type]);

  return <section aria-label="Environmental credit depository" className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <div><h2 className="text-xl font-semibold">Environmental Credits</h2><p className="text-sm opacity-70">Authoritative holdings available for sale</p></div>
      <div className="flex rounded-lg border p-1" role="tablist">
        {(['CCC','GREEN_CREDIT'] as CreditType[]).map(t => <button key={t} role="tab" aria-selected={type === t} onClick={() => setType(t)} className="rounded-md px-3 py-2 text-sm">{t === 'CCC' ? 'CCC' : 'Green Credit'}</button>)}
      </div>
    </div>
    {loading ? <div className="rounded-lg border p-6 text-sm">Loading authoritative inventory…</div> : positions.length === 0 ? <div className="rounded-lg border p-6 text-sm">No authoritative tradable holdings are currently available.</div> : <div className="grid gap-3">{positions.map(p => <article key={p.id} className="rounded-lg border p-4">
      <div className="flex items-center justify-between"><strong>{p.authoritative_credit_reference}</strong><span>{p.tradability_status}</span></div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm"><span>Registry: {p.authoritative_registry}</span><span>Status: {p.status}</span><span>Issued: {p.issued_quantity}</span><span>Available: {p.available_quantity}</span><span>Reserved: {p.reserved_quantity}</span></div>
      <p className="mt-3 text-xs opacity-60">Issuance is performed by the applicable authoritative programme; RupayKg is the depository/marketplace layer.</p>
    </article>)}</div>}
  </section>;
}
