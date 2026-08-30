import {
  BWGCategory,
  FourStreamType,
  BWGEligibilityResult,
  CPCBRenewalCalendarItem,
  CPCBBwgLogEntry,
  CPCBSwmIntegrationStatus
} from '../types.ts';

export class CpcbService {
  private logEntries: CPCBBwgLogEntry[] = [
    {
      id: 'LOG_CPCB_001',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      stream: 'WET_ORGANIC',
      wasteType: 'Food & Kitchen Waste',
      weightKg: 280,
      trackingCode: 'TRK-CPCB-WET-8821',
      vehicleNo: 'KA-01-EQ-9921',
      destinationFacility: 'On-site Biomethanation Plant / Municipal MRF-04',
      weighbridgeRef: 'WB-991204',
      evidencePhotoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500',
      geoLat: 12.9716,
      geoLng: 77.5946,
      co2eAvoidedKg: 252,
      verifiedBy: 'Senior Compliance Officer (ULB-Verified)',
      status: 'VERIFIED'
    },
    {
      id: 'LOG_CPCB_002',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      stream: 'DRY_RECYCLABLE',
      wasteType: 'Paper & Cardboard Waste',
      weightKg: 145,
      trackingCode: 'TRK-CPCB-DRY-3312',
      vehicleNo: 'KA-01-EQ-9921',
      destinationFacility: 'Authorized Paper Recycler (CPCB Reg. #REC-3382)',
      weighbridgeRef: 'WB-991205',
      evidencePhotoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500',
      geoLat: 12.9720,
      geoLng: 77.5950,
      co2eAvoidedKg: 130.5,
      verifiedBy: 'BWG Site Supervisor',
      status: 'VERIFIED'
    },
    {
      id: 'LOG_CPCB_003',
      date: new Date().toISOString().split('T')[0],
      stream: 'DOMESTIC_HAZARDOUS',
      wasteType: 'Used Black Oil / Spent Lubricant (Form-10 Manifested)',
      weightKg: 180,
      trackingCode: 'TRK-CPCB-HAZ-OIL-1049',
      vehicleNo: 'MP-09-HAZ-4821 (CPCB GPS Regd.)',
      destinationFacility: 'CPCB Authorized Refiner & Used Oil Recycler (Reg. #CPCB-OIL-REC-901)',
      weighbridgeRef: 'WB-991208',
      co2eAvoidedKg: 360,
      verifiedBy: 'Certified Environmental Auditor (Form-10 & GST Invoice Matched)',
      status: 'VERIFIED'
    },
    {
      id: 'LOG_CPCB_004',
      date: new Date().toISOString().split('T')[0],
      stream: 'SANITARY_REJECT',
      wasteType: 'Sanitary / Non-Recyclable Reject',
      weightKg: 35,
      trackingCode: 'TRK-CPCB-REJ-9910',
      vehicleNo: 'KA-01-EQ-9921',
      destinationFacility: 'Municipal WTE / Controlled Scientific Landfill',
      weighbridgeRef: 'WB-991209',
      co2eAvoidedKg: 10.5,
      verifiedBy: 'Municipal Inspector',
      status: 'DISPATCHED'
    }
  ];

  private calendarItems: CPCBRenewalCalendarItem[] = [
    {
      id: 'CAL_001',
      title: 'CPCB Form IV Annual SWM Compliance Return Filing',
      filingType: 'ANNUAL_FORM_IV',
      dueDate: '2026-06-30',
      status: 'COMPLETED',
      regulatoryBody: 'Central Pollution Control Board (CPCB) / SPCB',
      documentRef: 'DOC-CPCB-FORM4-2025-26',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'CAL_002',
      title: 'Extended Bulk Waste Generator Responsibility (EBWGR) Certificate Audit',
      filingType: 'EBWGR_CERTIFICATE',
      dueDate: '2026-08-15',
      status: 'PENDING',
      regulatoryBody: 'State Pollution Control Board (SPCB)',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'CAL_003',
      title: 'Monthly Four-Stream Waste Segregation Logbook Verification',
      filingType: 'MONTHLY_LOGBOOK',
      dueDate: '2026-08-05',
      status: 'PENDING',
      regulatoryBody: 'Urban Local Body (ULB) SWM Cell',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'CAL_004',
      title: 'Mandatory Quarterly Form-10 + GST E-Return Filing (Used Black Oil & Hazardous Waste 2026)',
      filingType: 'SPCB_PERMIT_RENEWAL',
      dueDate: '2026-09-30',
      status: 'PENDING',
      regulatoryBody: 'State Pollution Control Board (SPCB) & CPCB Hazardous Waste Portal',
      documentRef: 'FORM-10-Q2-2026-RETURN',
      lastUpdated: new Date().toISOString()
    }
  ];

  private integrations: CPCBSwmIntegrationStatus[] = [
    {
      portalName: 'CPCB Centralised SWM Portal',
      category: 'GOVT_PORTAL',
      status: 'ASSISTED_SUBMISSION',
      lastSync: new Date().toISOString(),
      totalSubmissions: 24,
      endpointUrl: 'https://cpcbswm.nic.in/api/v1/bwg-ingest'
    },
    {
      portalName: 'State Pollution Control Board (SPCB NOC / CTO Portal)',
      category: 'SPCB_REGULATOR',
      status: 'ACTIVE',
      lastSync: new Date().toISOString(),
      totalSubmissions: 12,
      endpointUrl: 'https://spcb.gov.in/ocms/bwg-returns'
    },
    {
      portalName: 'Urban Local Body (ULB) Swachh Bharat Platform',
      category: 'ULB_MUNICIPALITY',
      status: 'ACTIVE',
      lastSync: new Date().toISOString(),
      totalSubmissions: 148,
      endpointUrl: 'https://swachh.gov.in/ulb-api'
    },
    {
      portalName: 'Authorized Waste Processors & Recyclers Network',
      category: 'PROCESSOR_RECYCLER',
      status: 'DIRECT_API',
      lastSync: new Date().toISOString(),
      totalSubmissions: 320,
      endpointUrl: 'https://rupaykg.org/api/processors/manifest'
    },
    {
      portalName: 'ESG & Indian Carbon Market (CCTS) Registry',
      category: 'ESG_REGISTRY',
      status: 'ACTIVE',
      lastSync: new Date().toISOString(),
      totalSubmissions: 18,
      endpointUrl: 'https://ccts.beeindia.gov.in/mrv-connector'
    }
  ];

  public assessBwgEligibility(
    entityName: string,
    category: BWGCategory,
    dailyWasteKg: number,
    builtUpAreaSqm: number
  ): BWGEligibilityResult {
    // SWM Rules 2016 threshold: >= 100 kg/day or area >= 5,000 sqm
    const isWeightTrigger = dailyWasteKg >= 100;
    const isAreaTrigger = builtUpAreaSqm >= 5000;
    const isMandatoryBWG = isWeightTrigger || isAreaTrigger;

    const applicableRules = [
      'Solid Waste Management Rules 2016 (Rule 4 & Rule 13)',
      'CPCB Mandatory Four-Stream Segregation Directive (Wet, Dry, Hazardous, Sanitary)',
      isMandatoryBWG ? 'Mandatory On-site Wet Waste Processing / Biomethanation / Composting' : 'Voluntary Municipal Collection Agreement',
      'Extended Bulk Waste Generator Responsibility (EBWGR) Audit Standards',
      'Digital Weighbridge & GPS Vehicle Tracking Compliance'
    ];

    let complianceScore = 75;
    if (isMandatoryBWG) complianceScore = 88;

    return {
      category,
      entityName: entityName || 'Enterprise Bulk Waste Generator',
      dailyWasteKg,
      builtUpAreaSqm,
      isMandatoryBWG,
      applicableRules,
      mandatoryStreamCount: 4,
      onSiteProcessingRequired: isMandatoryBWG && dailyWasteKg >= 100,
      registrationStatus: isMandatoryBWG ? 'REGISTERED_CPCB' : 'EXEMPT',
      complianceScore
    };
  }

  public getLogEntries(): CPCBBwgLogEntry[] {
    return [...this.logEntries];
  }

  public addLogEntry(entry: Omit<CPCBBwgLogEntry, 'id' | 'co2eAvoidedKg'>): CPCBBwgLogEntry {
    let cccFactor = 0.9;
    if (entry.stream === 'WET_ORGANIC') cccFactor = 0.9;
    if (entry.stream === 'DRY_RECYCLABLE') cccFactor = 1.2;
    if (entry.stream === 'DOMESTIC_HAZARDOUS') cccFactor = 2.0;
    if (entry.stream === 'SANITARY_REJECT') cccFactor = 0.3;

    const newEntry: CPCBBwgLogEntry = {
      ...entry,
      id: `LOG_CPCB_${Date.now().toString().slice(-6)}`,
      co2eAvoidedKg: Number((entry.weightKg * cccFactor).toFixed(1))
    };

    this.logEntries.unshift(newEntry);
    return newEntry;
  }

  public getCalendarItems(): CPCBRenewalCalendarItem[] {
    return [...this.calendarItems];
  }

  public getIntegrations(): CPCBSwmIntegrationStatus[] {
    return [...this.integrations];
  }

  public calculateSummaryStats() {
    const totalWeightKg = this.logEntries.reduce((sum, e) => sum + e.weightKg, 0);
    const wetWasteKg = this.logEntries.filter(e => e.stream === 'WET_ORGANIC').reduce((sum, e) => sum + e.weightKg, 0);
    const dryWasteKg = this.logEntries.filter(e => e.stream === 'DRY_RECYCLABLE').reduce((sum, e) => sum + e.weightKg, 0);
    const hazWasteKg = this.logEntries.filter(e => e.stream === 'DOMESTIC_HAZARDOUS').reduce((sum, e) => sum + e.weightKg, 0);
    const rejectWasteKg = this.logEntries.filter(e => e.stream === 'SANITARY_REJECT').reduce((sum, e) => sum + e.weightKg, 0);

    const totalCo2eAvoidedKg = this.logEntries.reduce((sum, e) => sum + e.co2eAvoidedKg, 0);
    const diversionRatePercent = totalWeightKg > 0 ? Number((((wetWasteKg + dryWasteKg) / totalWeightKg) * 100).toFixed(1)) : 0;

    return {
      totalWeightKg,
      wetWasteKg,
      dryWasteKg,
      hazWasteKg,
      rejectWasteKg,
      totalCo2eAvoidedKg: Number(totalCo2eAvoidedKg.toFixed(1)),
      diversionRatePercent,
      activeIntegrations: this.integrations.filter(i => i.status === 'ACTIVE' || i.status === 'DIRECT_API').length,
      pendingCalendarItems: this.calendarItems.filter(c => c.status === 'PENDING').length
    };
  }
}

export const cpcbService = new CpcbService();
