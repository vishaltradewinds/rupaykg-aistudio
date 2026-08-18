import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Building2,
  Landmark,
  Truck,
  Recycle,
  Users,
  Globe,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  MapPin,
  FileText,
  BadgeCheck,
  Briefcase,
  Lock,
  Phone,
  User,
  Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StakeholderOnboardingHubProps {
  currentUser?: any;
  token?: string | null;
  onRegistered?: (user: any, token: string) => void;
  onNavigateToView?: (view: string) => void;
}

interface StakeholderCategory {
  id: string;
  categoryName: string;
  badge: string;
  color: string;
  description: string;
  roles: {
    roleCode: string;
    title: string;
    subtitle: string;
    statutoryMandate: string;
    keyDeliverables: string[];
    typicalEntity: string;
  }[];
}

const STAKEHOLDER_CATEGORIES: StakeholderCategory[] = [
  {
    id: 'urban',
    categoryName: 'Urban Governance & ULBs',
    badge: 'SWM & Smart Cities',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
    description: 'Municipal Corporations, Municipal Councils, Smart City SPVs, and Urban Local Bodies managing city-wide solid waste operations.',
    roles: [
      {
        roleCode: 'municipal_admin',
        title: 'Municipal Authority / ULB Admin',
        subtitle: 'City/Ward Level SWM Nodal Officer',
        statutoryMandate: 'SWM Rules 2016/2026 Rule 15, SBM-Urban 2.0 Compliance & Swachh Survekshan',
        keyDeliverables: ['Ward-level Door-to-Door Monitoring', 'MRF & Biomethanation Plant Oversight', 'Legacy Dumpsite Remediation Ledger'],
        typicalEntity: 'Municipal Corporation / Council / Nagar Panchayat'
      },
      {
        roleCode: 'municipal_generator',
        title: 'Bulk Municipal Facility Generator',
        subtitle: 'Wholesale Mandis, Bus Terminals, Municipal Parks',
        statutoryMandate: 'Rule 4(7) In-situ Processing & Segregated Waste Handover',
        keyDeliverables: ['On-site Wet Waste Composting Ledger', 'Bulk Dry Waste Transfer Slips', 'SWM Annual Manifest'],
        typicalEntity: 'APMC Market Yard / Municipal Complex'
      },
      {
        roleCode: 'state_admin',
        title: 'State Urban Development / SPCB Officer',
        subtitle: 'State-wide Monitoring & Regulatory Nodal',
        statutoryMandate: 'State SWM Policy & CPCB Annual Return Filing System',
        keyDeliverables: ['State-wide ULB Performance Dashboards', 'District SWM Allocation', 'State Action Plan Reporting'],
        typicalEntity: 'Directorate of Municipal Administration / SPCB'
      }
    ]
  },
  {
    id: 'rural',
    categoryName: 'Rural Governance & Agriculture',
    badge: 'GOBARdhan & FPO',
    color: 'from-emerald-500/20 to-lime-500/20 border-emerald-500/30 text-emerald-400',
    description: 'Gram Panchayats, Blocks, Farmer Producer Organizations (FPOs), Cooperatives, and Village Resource Centres.',
    roles: [
      {
        roleCode: 'fpo',
        title: 'Gram Panchayat / FPO / Rural Enterprise',
        subtitle: 'Village Level Biomass & Plastic Aggregation',
        statutoryMandate: 'SBM-Gramin Phase II, GOBARdhan Scheme & AgriStack Circular Ledger',
        keyDeliverables: ['Crop Stubble / Biomass Collection', 'Village Bio-CNG / Biogas Tracking', 'Vermicompost Sales Ledger'],
        typicalEntity: 'FPO / Gram Panchayat / SHG Cluster'
      },
      {
        roleCode: 'farmer',
        title: 'Farmer / Biomass Aggregator',
        subtitle: 'Individual & Group Crop Residue Aggregators',
        statutoryMandate: 'Ex-situ Crop Residue Utilization & Carbon Credit Monetization',
        keyDeliverables: ['Residue Tonnage Logging', 'Direct Farmer Payout Disbursal', 'Soil Carbon Improvement Verifications'],
        typicalEntity: 'Farmer Producer / Primary Agricultural Society'
      },
      {
        roleCode: 'safai_mitra',
        title: 'Safai Mitra / Informal Waste Picker',
        subtitle: 'Frontline Circular Economy Worker',
        statutoryMandate: 'Formalized Integration & Direct Digital DBT Payments',
        keyDeliverables: ['Daily Collection Log', 'Fair Market Weight Slips', 'Social Security & Health Scheme Registry'],
        typicalEntity: 'Safai Mitra Collective / Urban Informal Waste Guild'
      }
    ]
  },
  {
    id: 'logistics',
    categoryName: 'Logistics, Recycling & Processing',
    badge: 'Circular Industry',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    description: 'Authorized Waste Aggregators, Material Recovery Facilities (MRFs), Recyclers, Refuse Derived Fuel (RDF) and Waste-to-Energy operators.',
    roles: [
      {
        roleCode: 'aggregator',
        title: 'Waste Aggregator / Logistics Partner',
        subtitle: 'Bada Kabadiwala / Fleet Aggregator',
        statutoryMandate: 'GPS Geo-tagged Chain of Custody & Consignment Manifests',
        keyDeliverables: ['Digital Waybills & Weighbridge Receipts', 'Dynamic Fleet Routing', 'EPR Traceability Proofs'],
        typicalEntity: 'Waste Management Enterprise / Aggregation Depot'
      },
      {
        roleCode: 'processor',
        title: 'Recycler / MRF / Processing Plant',
        subtitle: 'Secondary Material Transformation Facility',
        statutoryMandate: 'State Pollution Control Board (SPCB) Authorization & Mass Balance Audit',
        keyDeliverables: ['Recycling Certificate Issuance', 'EPR Credit Generation', 'Mass Balance Yield Reports'],
        typicalEntity: 'Plastic Recycler / Compost Facility / RDF Unit'
      }
    ]
  },
  {
    id: 'bwg',
    categoryName: 'Bulk Waste Generators (BWGs)',
    badge: 'Statutory BWG',
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
    description: 'Industrial complexes, IT parks, commercial malls, hotels, hospitals, educational campuses generating waste over 100 kg/day.',
    roles: [
      {
        roleCode: 'industry_generator',
        title: 'Industrial Facility Generator',
        subtitle: 'Manufacturing & Industrial Estates',
        statutoryMandate: 'SWM Rules Rule 4(7) & Industrial Non-Hazardous Waste Guidelines',
        keyDeliverables: ['Industrial Byproduct Ledger', 'Circular Supply Chain Tie-ups', 'Monthly SWM Compliance Log'],
        typicalEntity: 'Factory / Industrial Hub / Special Economic Zone'
      },
      {
        roleCode: 'commercial_generator',
        title: 'Commercial Establishment Generator',
        subtitle: 'Hotels, Malls, Tech Parks, Hospitals',
        statutoryMandate: 'Mandatory Source Segregation & Authorized Recycler Handover',
        keyDeliverables: ['Food Waste Digestion Metrics', 'Recyclable Plastic Manifests', 'Zero Waste to Landfill Proofs'],
        typicalEntity: 'Tech Park / Hotel / Mall / Hospital Chain'
      },
      {
        roleCode: 'institution_generator',
        title: 'Institutional Facility Generator',
        subtitle: 'Universities, Government Complexes, Railways',
        statutoryMandate: 'Green Campus SWM Guidelines & Sustainable Procurement',
        keyDeliverables: ['Campus Waste Stream Audits', 'Organic Waste Processing Logs', 'ESG Campus Certifications'],
        typicalEntity: 'University / Railway Division / Cantonment'
      }
    ]
  },
  {
    id: 'carbon',
    categoryName: 'CCTS Carbon Market & Sovereign MRV',
    badge: 'Carbon Credit OS',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300',
    description: 'Bureau of Energy Efficiency (BEE) Carbon Credit Trading Scheme (CCTS), Verifiers (ACVAs), Project Developers, and Obligated Entities.',
    roles: [
      {
        roleCode: 'PROJECT_OWNER',
        title: 'Carbon Project Developer / Owner',
        subtitle: 'CCTS & Voluntary Carbon Project Proponent',
        statutoryMandate: 'BEE CCTS Framework & Article 6 Sovereign Registry Compliance',
        keyDeliverables: ['PDD Compilation & Issuance', 'Digital Sensor Telemetry Feed', 'CCC / ESG Offset Minting'],
        typicalEntity: 'Carbon Project Developer / Clean Tech SPV'
      },
      {
        roleCode: 'ACVA_USER',
        title: 'Accredited Carbon Verification Agency (ACVA)',
        subtitle: 'Independent Third-Party Designated Operational Entity',
        statutoryMandate: 'ISO 14064-3 / BEE ACVA Accreditation Protocol',
        keyDeliverables: ['Validation Report Issuance', 'Verification & Baseline Audits', 'Tamper-evident Blockchain Signs'],
        typicalEntity: 'Accredited Verification Body / Audit Firm'
      },
      {
        roleCode: 'ccc_buyer',
        title: 'Carbon Credit / ESG Offset Buyer',
        subtitle: 'Obligated Entities, Corporates, Financial Institutions',
        statutoryMandate: 'CCTS Compliance Obligation & BRSR Core ESG Reporting',
        keyDeliverables: ['Digital Carbon Registry Retirements', 'BRSR Scope 1/2/3 Proofs', 'Hedera Guardian Verification Slips'],
        typicalEntity: 'Obligated Industry / Corporate ESG Desk'
      }
    ]
  },
  {
    id: 'compliance',
    categoryName: 'Regulators, PROs & EPR Brands',
    badge: 'Regulatory Core',
    color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
    description: 'Pollution Control Boards, Producer Responsibility Organizations (PROs), Brand Owners, and Statutory Auditors.',
    roles: [
      {
        roleCode: 'regulator',
        title: 'Environmental Regulator / CPCB Officer',
        subtitle: 'Statutory SWM & EPR Compliance Monitor',
        statutoryMandate: 'CPCB EPR Portal Guidelines & Environmental Protection Act',
        keyDeliverables: ['Real-time ULB Compliance Heatmaps', 'EPR Certificate Audit Trail', 'Pollution Non-compliance Notices'],
        typicalEntity: 'CPCB / SPCB / Ministry of Environment'
      },
      {
        roleCode: 'epr_partner',
        title: 'EPR Brand Owner / PRO Partner',
        subtitle: 'Producers, Importers, Brand Owners (PIBOs)',
        statutoryMandate: 'Plastic Waste / Battery / E-Waste EPR Mandatory Targets',
        keyDeliverables: ['EPR Credit Fulfillment Slips', 'SPCB Recycling Certificate Trace', 'Annual EPR Return Filings'],
        typicalEntity: 'FMCG Brand / Electronics Manufacturer / PRO'
      }
    ]
  }
];

const POPULAR_STATES = [
  'Madhya Pradesh',
  'Maharashtra',
  'Uttar Pradesh',
  'Karnataka',
  'Tamil Nadu',
  'Gujarat',
  'Rajasthan',
  'Telangana',
  'Delhi',
  'Haryana',
  'Punjab',
  'West Bengal',
  'Odisha',
  'Bihar',
  'Kerala',
  'Andhra Pradesh',
  'Assam',
  'Chhattisgarh',
  'Jharkhand',
  'Uttarakhand'
];

export const StakeholderOnboardingHub: React.FC<StakeholderOnboardingHubProps> = ({
  currentUser,
  token,
  onRegistered,
  onNavigateToView
}) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('urban');
  const [selectedRole, setSelectedRole] = useState<string>('municipal_admin');
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    loginId: currentUser?.phone || currentUser?.loginId || '',
    email: currentUser?.email || '',
    password: '',
    confirmPassword: '',
    organization_name: currentUser?.organization_name || '',
    state: currentUser?.state || 'Madhya Pradesh',
    district: currentUser?.district || 'Jabalpur',
    subdistrict: currentUser?.subdistrict || '',
    local_area: currentUser?.local_area || '',
    facility_type: 'Material Recovery Facility (MRF)',
    registration_code: '',
    capacity_tpd: '25'
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [registeredData, setRegisteredData] = useState<any>(null);

  const activeCategoryObj = STAKEHOLDER_CATEGORIES.find(c => c.id === selectedCategory) || STAKEHOLDER_CATEGORIES[0];
  const activeRoleObj = activeCategoryObj.roles.find(r => r.roleCode === selectedRole) || activeCategoryObj.roles[0];

  const handleRoleSelect = (catId: string, roleCode: string) => {
    setSelectedCategory(catId);
    setSelectedRole(roleCode);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (!formData.name.trim()) throw new Error('Please enter your Full Name.');
      if (!formData.phone.trim() && !formData.loginId.trim()) throw new Error('Please enter your Mobile Number or Login ID.');
      
      const regPassword = formData.password.trim() || 'password123';
      const identifier = formData.phone.trim() || formData.loginId.trim();

      if (token) {
        // Authenticated stakeholder role upgrade/registration
        const res = await fetch('/api/auth/register-stakeholder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            role: selectedRole,
            name: formData.name,
            phone: formData.phone || identifier,
            state: formData.state,
            district: formData.district,
            subdistrict: formData.subdistrict,
            local_area: formData.local_area,
            organization_name: formData.organization_name || activeRoleObj.typicalEntity
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to complete stakeholder registration.');

        if (data.token) {
          localStorage.setItem('rupay_token', data.token);
        }

        setIsSuccess(true);
        setRegisteredData(data.user);
        setMessage({
          type: 'success',
          text: `Stakeholder successfully onboarded as "${activeRoleObj.title}"! All permissions and operational engines are now activated.`
        });

        if (onRegistered) {
          onRegistered(data.user, data.token || token);
        }
      } else {
        // Unauthenticated new stakeholder self-registration
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: identifier,
            loginId: identifier,
            email: formData.email || `${identifier}@rupaykg.org`,
            password: regPassword,
            role: selectedRole,
            state: formData.state,
            district: formData.district,
            subdistrict: formData.subdistrict,
            local_area: formData.local_area,
            organization_name: formData.organization_name || activeRoleObj.typicalEntity
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed.');

        if (data.token && data.user) {
          localStorage.setItem('rupay_token', data.token);
          setIsSuccess(true);
          setRegisteredData(data.user);
          setMessage({
            type: 'success',
            text: `Welcome to RupayKg! You are registered and logged in as "${activeRoleObj.title}".`
          });

          if (onRegistered) {
            onRegistered(data.user, data.token);
          }
        } else {
          setIsSuccess(true);
          setMessage({
            type: 'success',
            text: `Registration successful for ${activeRoleObj.title}. Please sign in using your mobile number and password.`
          });
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#121214] via-[#16161A] to-[#0D1812] p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={14} />
              {t('Enterprise Stakeholder Onboarding Engine')}
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {t('Stakeholder Registration & Operational Activation')}
            </h1>
            <p className="text-white/60 text-sm md:text-base mt-2 max-w-2xl">
              {t('Official onboarding portal for Urban Local Bodies, Panchayats, Bulk Waste Generators, Recyclers, Carbon Project Developers, and Environmental Regulators under SWM Rules 2016/2026 and CCTS.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentUser?.role ? (
              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-right">
                <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Current Active Identity</span>
                <span className="text-sm font-bold text-emerald-400">{currentUser.name} ({currentUser.role})</span>
              </div>
            ) : (
              <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>New Stakeholder Self-Enrollment</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isSuccess && registeredData ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-emerald-500/40 bg-emerald-950/20 p-8 text-center space-y-6 max-w-3xl mx-auto"
        >
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/40">
            <BadgeCheck size={36} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{t('Stakeholder Enrollment Activated!')}</h2>
            <p className="text-white/70 text-sm max-w-lg mx-auto">
              Your entity has been verified and registered on the RupayKg Circular Economy Operating System with sovereign credentials.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-black/40 p-4 rounded-2xl border border-white/10 text-left text-xs">
            <div>
              <span className="text-white/40 block text-[10px] uppercase font-bold">Stakeholder Role</span>
              <span className="text-emerald-300 font-bold">{registeredData.role}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px] uppercase font-bold">Assigned User</span>
              <span className="text-white font-medium">{registeredData.name}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px] uppercase font-bold">Territory / District</span>
              <span className="text-white font-medium">{registeredData.district || 'National'}, {registeredData.state}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px] uppercase font-bold">Status</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check size={12} /> Active & Verified
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToView ? onNavigateToView('dashboard') : window.location.reload()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <ArrowRight size={16} />
              {t('Proceed to Stakeholder Operating Console')}
            </button>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all"
            >
              {t('Register Another Stakeholder / Facility')}
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Stakeholder Category & Role Selector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#151518] p-5 shadow-xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3 flex items-center gap-2">
                <Building2 size={16} className="text-emerald-400" />
                Step 1: Choose Stakeholder Pillar
              </h2>

              <div className="grid grid-cols-2 gap-2">
                {STAKEHOLDER_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedRole(cat.roles[0].roleCode);
                      }}
                      className={`p-3 rounded-xl text-left transition-all border ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                          : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70 mb-1">{cat.badge}</span>
                      <span className="text-xs font-bold block">{cat.categoryName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Roles in selected category */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">
                  Step 2: Select Specific Statutory Role
                </h3>
                <div className="space-y-2">
                  {activeCategoryObj.roles.map((r) => {
                    const isRoleActive = selectedRole === r.roleCode;
                    return (
                      <button
                        key={r.roleCode}
                        onClick={() => setSelectedRole(r.roleCode)}
                        className={`w-full p-3.5 rounded-xl text-left transition-all border flex items-start justify-between gap-3 ${
                          isRoleActive
                            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border-emerald-500 text-white shadow-lg'
                            : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{r.title}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-white/60">
                              {r.roleCode}
                            </span>
                          </div>
                          <p className="text-xs text-white/50">{r.subtitle}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isRoleActive ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-white/20'
                        }`}>
                          {isRoleActive && <Check size={12} className="stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Role Statutory Summary Card */}
            <div className="rounded-2xl border border-white/10 bg-[#151518] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <FileCheck2 size={16} />
                  Statutory Mandate & Capabilities
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-medium">
                  {activeRoleObj.roleCode}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-white/80 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-white/40 block">Legal / Regulatory Framework</span>
                <p className="font-semibold text-emerald-300">{activeRoleObj.statutoryMandate}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-white/40 block mb-2">Automated Operational Engines Enabled</span>
                <ul className="space-y-1.5">
                  {activeRoleObj.keyDeliverables.map((item, idx) => (
                    <li key={idx} className="text-xs text-white/70 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] text-white/50 pt-2 border-t border-white/5">
                <strong>Standard Target Entity:</strong> {activeRoleObj.typicalEntity}
              </div>
            </div>
          </div>

          {/* Right Column: Registration / Onboarding Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#151518] p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Briefcase size={20} className="text-emerald-400" />
                    {t('Step 3: Complete Stakeholder Credentials')}
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Activating: <strong className="text-emerald-300">{activeRoleObj.title}</strong>
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                  Role: {selectedRole}
                </span>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-xl text-xs flex items-center gap-3 ${
                    message.type === 'success'
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                      : message.type === 'info'
                      ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                      : 'bg-red-500/20 border border-red-500/30 text-red-300'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0 text-red-400" />}
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal & Auth Credentials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5 flex items-center gap-1.5">
                      <User size={14} className="text-emerald-400" />
                      Authorized Officer / User Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full bg-[#1C1C20] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5 flex items-center gap-1.5">
                      <Phone size={14} className="text-emerald-400" />
                      Mobile Number / Login ID *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value, loginId: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-[#1C1C20] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {!token && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5 flex items-center gap-1.5">
                        <Lock size={14} className="text-emerald-400" />
                        Account Password *
                      </label>
                      <input
                        type="password"
                        required={!token}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Create strong password"
                        className="w-full bg-[#1C1C20] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5 flex items-center gap-1.5">
                        <Globe size={14} className="text-emerald-400" />
                        Official Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. nodalofficer@jabalpur.gov.in"
                        className="w-full bg-[#1C1C20] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Organization Details */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5 flex items-center gap-1.5">
                    <Building2 size={14} className="text-emerald-400" />
                    Organization / Entity / Facility Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization_name}
                    onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                    placeholder={`e.g. Jabalpur Municipal Corporation / Green Bharat Recyclers Pvt Ltd`}
                    className="w-full bg-[#1C1C20] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Territorial Hierarchy (LGD Bound) */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <MapPin size={14} />
                    Territorial & Jurisdictional Jurisdiction (LGD)
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-white/60 mb-1">State / UT *</label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-[#1C1C20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      >
                        {POPULAR_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-white/60 mb-1">District *</label>
                      <input
                        type="text"
                        required
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        placeholder="e.g. Jabalpur, Indore, Pune"
                        className="w-full bg-[#1C1C20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-white/60 mb-1">Sub-District / Tehsil / Block</label>
                      <input
                        type="text"
                        value={formData.subdistrict}
                        onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                        placeholder="e.g. Patan, Jabalpur Urban"
                        className="w-full bg-[#1C1C20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-white/60 mb-1">Ward / Gram Panchayat / Zone / Local Area</label>
                      <input
                        type="text"
                        value={formData.local_area}
                        onChange={(e) => setFormData({ ...formData, local_area: e.target.value })}
                        placeholder="e.g. Ward 12, Industrial Estate Phase 2"
                        className="w-full bg-[#1C1C20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Facility / License Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5 flex items-center gap-1.5">
                      <FileText size={14} className="text-emerald-400" />
                      Facility / SPCB Authorization / CPCB Reg No.
                    </label>
                    <input
                      type="text"
                      value={formData.registration_code}
                      onChange={(e) => setFormData({ ...formData, registration_code: e.target.value })}
                      placeholder="e.g. SPCB/AUTH/2026/089"
                      className="w-full bg-[#1C1C20] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5 flex items-center gap-1.5">
                      <Recycle size={14} className="text-emerald-400" />
                      Daily Handling / Generation Capacity (TPD)
                    </label>
                    <input
                      type="number"
                      value={formData.capacity_tpd}
                      onChange={(e) => setFormData({ ...formData, capacity_tpd: e.target.value })}
                      placeholder="25"
                      className="w-full bg-[#1C1C20] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !selectedRole}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        {token
                          ? `Activate ${activeRoleObj.title} Identity`
                          : `Complete Stakeholder Registration & Access OS`}
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-white/40 mt-2">
                    Secured by Sovereign Indian Cryptographic Key & CPCB/BEE Regulatory Audit Integrity Protocol.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
