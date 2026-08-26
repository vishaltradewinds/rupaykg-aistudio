import { db } from './index.ts';
import { cqe_methodologies, operational_logs } from './schema.ts';
import { eq, desc, and, or, ilike } from 'drizzle-orm';
import { CQEMethodologyDefinition } from '../types.ts';
import { BEE_APPROVED_METHODOLOGIES } from '../services/carbonEngine.ts';
import crypto from 'crypto';

export class CqeMethodologyDbService {
  /**
   * Log an immutable audit record for methodology operations
   */
  public static async logAudit(
    operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'VERSION' | 'APPROVE' | 'PUBLISH' | 'RETIRE' | 'RESET',
    methodologyId: string,
    actor: { id?: string; name?: string; role?: string } | string,
    details: { before?: any; after?: any; correlationId?: string; reason?: string } = {}
  ): Promise<void> {
    try {
      const actorId = typeof actor === 'string' ? actor : (actor.id || actor.name || 'system');
      const correlationId = details.correlationId || `AUD-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      
      await db.insert(operational_logs).values({
        id: `LOG-CQE-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
        level: 'INFO',
        category: 'CQE_METHODOLOGY_AUDIT',
        message: `Methodology [${methodologyId}] operation ${operation} executed by ${actorId}`,
        userId: actorId,
        metadata: {
          operation,
          methodologyId,
          actor: typeof actor === 'object' ? actor : { id: actor },
          correlationId,
          before: details.before,
          after: details.after,
          reason: details.reason,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err: any) {
      console.error('[CQE Audit Log Failure]', err.message);
      // In strict audit mode, do not suppress database write errors
      throw new Error(`Audit log creation failed: ${err.message}`);
    }
  }

  /**
   * Fetch all methodologies combining official immutable BEE references with PostgreSQL custom records
   */
  public static async getAllMethodologies(filter?: {
    sector?: string;
    status?: string;
    sourceType?: string;
    search?: string;
  }): Promise<CQEMethodologyDefinition[]> {
    // 1. Fetch custom methodologies from PostgreSQL
    let customRecords: any[] = [];
    try {
      customRecords = await db.select().from(cqe_methodologies).orderBy(desc(cqe_methodologies.createdAt));
    } catch (err: any) {
      console.error('[CqeMethodologyDbService.getAllMethodologies Error]', err.message);
      throw new Error(`Authoritative methodology database query failed: ${err.message}`);
    }

    const customDefs: CQEMethodologyDefinition[] = customRecords.map(r => ({
      methodologyId: r.id,
      methodologyCode: r.methodologyCode,
      title: r.title,
      description: r.description || undefined,
      sector: r.sector,
      version: r.version,
      status: r.status as any,
      sourceType: r.sourceType,
      baselineRules: r.baselineRules || '',
      projectRules: r.projectRules || '',
      leakageRules: r.leakageRules || '',
      applicability: (r.applicability as string[]) || [],
      monitoringRequirements: (r.monitoringRequirements as string[]) || [],
      parameters: (r.parameters as any[]) || [],
      emissionFactors: (r.emissionFactors as any[]) || [],
      toolsRequired: (r.toolsRequired as string[]) || [],
      creditingPeriodRules: r.creditingPeriodRules || '',
      effectiveDate: r.effectiveDate || '',
      sourceDocument: r.sourceDocument || '',
      issuer: r.issuer || '',
      changelog: r.changelog || '',
      baselineEquationLatex: r.baselineEquationLatex || undefined,
      projectEquationLatex: r.projectEquationLatex || undefined,
      leakageEquationLatex: r.leakageEquationLatex || undefined,
      acvaAccreditationStandard: r.acvaAccreditationStandard || undefined,
      uploadedBy: r.createdBy || undefined,
      supersededBy: r.supersededBy || undefined,
      lastUpdated: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString()
    }));

    // 2. Tag official BEE standards explicitly as SYSTEM_REFERENCE
    const systemRefs: CQEMethodologyDefinition[] = BEE_APPROVED_METHODOLOGIES.map(m => ({
      ...m,
      sourceType: 'SYSTEM_REFERENCE'
    }));

    // If custom database overrides any system reference with exact ID, prioritize PostgreSQL custom record
    const customIds = new Set(customDefs.map(c => c.methodologyId));
    const nonOverriddenSystemRefs = systemRefs.filter(s => !customIds.has(s.methodologyId));

    let combined = [...customDefs, ...nonOverriddenSystemRefs];

    if (filter?.sourceType && filter.sourceType !== 'ALL') {
      combined = combined.filter(m => (m.sourceType || 'SYSTEM_REFERENCE') === filter.sourceType);
    }
    if (filter?.sector && filter.sector !== 'ALL') {
      combined = combined.filter(m => m.sector.toLowerCase().includes(filter.sector!.toLowerCase()));
    }
    if (filter?.status && filter.status !== 'ALL') {
      combined = combined.filter(m => m.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      combined = combined.filter(m =>
        m.methodologyCode.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.sector.toLowerCase().includes(q) ||
        (m.sourceDocument && m.sourceDocument.toLowerCase().includes(q))
      );
    }

    return combined;
  }

  /**
   * Get single methodology by ID from PostgreSQL or fallback to immutable BEE reference
   */
  public static async getMethodologyById(id: string): Promise<CQEMethodologyDefinition | null> {
    try {
      const rows = await db.select().from(cqe_methodologies).where(eq(cqe_methodologies.id, id)).limit(1);
      if (rows.length > 0) {
        const r = rows[0];
        return {
          methodologyId: r.id,
          methodologyCode: r.methodologyCode,
          title: r.title,
          description: r.description || undefined,
          sector: r.sector,
          version: r.version,
          status: r.status as any,
          sourceType: r.sourceType,
          baselineRules: r.baselineRules || '',
          projectRules: r.projectRules || '',
          leakageRules: r.leakageRules || '',
          applicability: (r.applicability as string[]) || [],
          monitoringRequirements: (r.monitoringRequirements as string[]) || [],
          parameters: (r.parameters as any[]) || [],
          emissionFactors: (r.emissionFactors as any[]) || [],
          toolsRequired: (r.toolsRequired as string[]) || [],
          creditingPeriodRules: r.creditingPeriodRules || '',
          effectiveDate: r.effectiveDate || '',
          sourceDocument: r.sourceDocument || '',
          issuer: r.issuer || '',
          changelog: r.changelog || '',
          baselineEquationLatex: r.baselineEquationLatex || undefined,
          projectEquationLatex: r.projectEquationLatex || undefined,
          leakageEquationLatex: r.leakageEquationLatex || undefined,
          acvaAccreditationStandard: r.acvaAccreditationStandard || undefined,
          uploadedBy: r.createdBy || undefined,
          supersededBy: r.supersededBy || undefined,
          lastUpdated: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString()
        };
      }
    } catch (err: any) {
      console.error('[CqeMethodologyDbService.getMethodologyById Error]', err.message);
      throw new Error(`Database read failed for methodology ${id}: ${err.message}`);
    }

    // Check system reference
    const sys = BEE_APPROVED_METHODOLOGIES.find(m => m.methodologyId === id);
    if (sys) {
      return {
        ...sys,
        sourceType: 'SYSTEM_REFERENCE'
      };
    }

    return null;
  }

  /**
   * Persist a new methodology in PostgreSQL and record audit log
   */
  public static async registerMethodology(
    def: Partial<CQEMethodologyDefinition>,
    actor: { id?: string; name?: string; role?: string } | string = 'BEE Administrator',
    sourceType: 'CUSTOM' | 'IMPORTED' | 'BEE_OFFICIAL' = 'CUSTOM'
  ): Promise<CQEMethodologyDefinition> {
    if (!def.methodologyCode || !def.title) {
      throw new Error("Methodology Code and Title are mandatory.");
    }

    const version = def.version || "1.0";
    const cleanCode = def.methodologyCode.trim();
    const methodologyId = def.methodologyId || `${cleanCode.replace(/\s+/g, '-')}-v${version}`;
    const actorId = typeof actor === 'string' ? actor : (actor.id || actor.name || 'system');

    const newRecord = {
      id: methodologyId,
      methodologyCode: cleanCode,
      title: def.title,
      description: def.description || null,
      sector: def.sector || "Waste Handling & Disposal",
      version,
      status: def.status || "ACTIVE",
      sourceType,
      baselineRules: def.baselineRules || "Baseline emissions calculated as per BEE CCTS Offset standard.",
      projectRules: def.projectRules || "Project emissions from auxiliary electricity, fuel, and processing.",
      leakageRules: def.leakageRules || "Measurable boundary displacement leakage.",
      applicability: def.applicability && def.applicability.length > 0 ? def.applicability : ["General CCTS Offset applicability"],
      monitoringRequirements: def.monitoringRequirements || ["Continuous weighbridge logs", "Material assay certificates"],
      parameters: def.parameters || [],
      emissionFactors: def.emissionFactors || [
        { name: "National Grid Factor", code: "EF_GRID_IN", value: 0.716, unit: "tCO2e/MWh", source: "CEA CO2 Baseline" }
      ],
      toolsRequired: def.toolsRequired || ["BM-T-011"],
      creditingPeriodRules: def.creditingPeriodRules || "10-year fixed crediting period",
      effectiveDate: def.effectiveDate || new Date().toISOString().slice(0, 10),
      sourceDocument: def.sourceDocument || `BEE/CCTS/OM/${cleanCode}/${new Date().getFullYear()}`,
      sourceReference: def.sourceReference || null,
      evidenceReference: def.evidenceReference || null,
      issuer: def.issuer || "Bureau of Energy Efficiency (BEE), Ministry of Power",
      changelog: def.changelog || "Initial canonical registration under CCTS OM 2026.",
      baselineEquationLatex: def.baselineEquationLatex || null,
      projectEquationLatex: def.projectEquationLatex || null,
      leakageEquationLatex: def.leakageEquationLatex || null,
      acvaAccreditationStandard: def.acvaAccreditationStandard || "ISO 14065 / BEE Empanelled ACVA",
      tenantId: def.tenantId || null,
      createdBy: actorId,
      approvedBy: def.approvedBy || null,
      approvedAt: def.approvedAt ? new Date(def.approvedAt) : null,
      supersededBy: null,
      metadata: def.metadata || null,
      updatedAt: new Date()
    };

    // Upsert to PostgreSQL
    try {
      const existing = await db.select().from(cqe_methodologies).where(eq(cqe_methodologies.id, methodologyId));
      if (existing.length > 0) {
        await db.update(cqe_methodologies).set(newRecord).where(eq(cqe_methodologies.id, methodologyId));
      } else {
        await db.insert(cqe_methodologies).values(newRecord);
      }
    } catch (err: any) {
      console.error('[CqeMethodologyDbService.registerMethodology DB Error]', err.message);
      throw new Error(`Failed to persist methodology in PostgreSQL: ${err.message}`);
    }

    // Audit Log
    await this.logAudit('CREATE', methodologyId, actor, { after: newRecord });

    const saved = await this.getMethodologyById(methodologyId);
    if (!saved) {
      throw new Error("Methodology persistence failed verification check.");
    }
    return saved;
  }

  /**
   * Update an existing methodology in PostgreSQL
   */
  public static async updateMethodology(
    id: string,
    updates: Partial<CQEMethodologyDefinition>,
    actor: { id?: string; name?: string; role?: string } | string = 'BEE Administrator'
  ): Promise<CQEMethodologyDefinition> {
    const existing = await this.getMethodologyById(id);
    if (!existing) {
      throw new Error(`Methodology with ID ${id} not found.`);
    }

    if (existing.sourceType === 'SYSTEM_REFERENCE') {
      // Create a custom fork in PostgreSQL
      return await this.registerMethodology({ ...existing, ...updates, methodologyId: id }, actor, 'CUSTOM');
    }

    const updatePayload: any = {
      updatedAt: new Date()
    };

    if (updates.title) updatePayload.title = updates.title;
    if (updates.description !== undefined) updatePayload.description = updates.description;
    if (updates.sector) updatePayload.sector = updates.sector;
    if (updates.status) updatePayload.status = updates.status;
    if (updates.baselineRules) updatePayload.baselineRules = updates.baselineRules;
    if (updates.projectRules) updatePayload.projectRules = updates.projectRules;
    if (updates.leakageRules) updatePayload.leakageRules = updates.leakageRules;
    if (updates.applicability) updatePayload.applicability = updates.applicability;
    if (updates.monitoringRequirements) updatePayload.monitoringRequirements = updates.monitoringRequirements;
    if (updates.parameters) updatePayload.parameters = updates.parameters;
    if (updates.emissionFactors) updatePayload.emissionFactors = updates.emissionFactors;
    if (updates.toolsRequired) updatePayload.toolsRequired = updates.toolsRequired;
    if (updates.creditingPeriodRules) updatePayload.creditingPeriodRules = updates.creditingPeriodRules;
    if (updates.effectiveDate) updatePayload.effectiveDate = updates.effectiveDate;
    if (updates.sourceDocument) updatePayload.sourceDocument = updates.sourceDocument;
    if (updates.issuer) updatePayload.issuer = updates.issuer;
    if (updates.changelog) updatePayload.changelog = updates.changelog;
    if (updates.baselineEquationLatex !== undefined) updatePayload.baselineEquationLatex = updates.baselineEquationLatex;
    if (updates.projectEquationLatex !== undefined) updatePayload.projectEquationLatex = updates.projectEquationLatex;
    if (updates.leakageEquationLatex !== undefined) updatePayload.leakageEquationLatex = updates.leakageEquationLatex;
    if (updates.acvaAccreditationStandard) updatePayload.acvaAccreditationStandard = updates.acvaAccreditationStandard;
    if (updates.approvedBy) updatePayload.approvedBy = updates.approvedBy;

    try {
      await db.update(cqe_methodologies).set(updatePayload).where(eq(cqe_methodologies.id, id));
    } catch (err: any) {
      console.error('[CqeMethodologyDbService.updateMethodology DB Error]', err.message);
      throw new Error(`Failed to update methodology in PostgreSQL: ${err.message}`);
    }

    await this.logAudit('UPDATE', id, actor, { before: existing, after: updatePayload });

    const updated = await this.getMethodologyById(id);
    return updated!;
  }

  /**
   * Create a new version of an existing methodology
   */
  public static async createNewVersion(
    baseId: string,
    newVersion: string,
    changelog: string,
    overrides?: Partial<CQEMethodologyDefinition>,
    actor: { id?: string; name?: string; role?: string } | string = 'BEE Administrator'
  ): Promise<{ previousVersion: CQEMethodologyDefinition; newVersion: CQEMethodologyDefinition }> {
    const base = await this.getMethodologyById(baseId);
    if (!base) {
      throw new Error(`Base methodology ${baseId} not found.`);
    }

    const newId = `${base.methodologyCode.replace(/\s+/g, '-')}-v${newVersion}`;

    // Mark previous as SUPERSEDED in PostgreSQL
    if (base.sourceType !== 'SYSTEM_REFERENCE') {
      await db.update(cqe_methodologies).set({
        status: 'SUPERSEDED',
        supersededBy: newId,
        updatedAt: new Date()
      }).where(eq(cqe_methodologies.id, baseId));
    }

    // Register new version
    const newDef = await this.registerMethodology({
      ...base,
      ...overrides,
      methodologyId: newId,
      version: newVersion,
      status: 'ACTIVE',
      changelog: changelog || `Version ${newVersion} published. Supersedes ${base.version}.`,
      effectiveDate: overrides?.effectiveDate || new Date().toISOString().slice(0, 10),
      supersededBy: undefined
    }, actor, 'CUSTOM');

    await this.logAudit('VERSION', newId, actor, {
      before: { baseId, version: base.version },
      after: { newId, version: newVersion, changelog }
    });

    const refreshedBase = await this.getMethodologyById(baseId);
    return {
      previousVersion: refreshedBase || { ...base, status: 'SUPERSEDED', supersededBy: newId },
      newVersion: newDef
    };
  }

  /**
   * Delete custom methodology from PostgreSQL
   */
  public static async deleteMethodology(
    id: string,
    actor: { id?: string; name?: string; role?: string } | string = 'BEE Administrator'
  ): Promise<boolean> {
    const existing = await this.getMethodologyById(id);
    if (!existing) return false;

    if (existing.sourceType === 'SYSTEM_REFERENCE') {
      throw new Error("System reference methodologies from the official BEE catalogue cannot be deleted. They are immutable standards.");
    }

    try {
      await db.delete(cqe_methodologies).where(eq(cqe_methodologies.id, id));
    } catch (err: any) {
      console.error('[CqeMethodologyDbService.deleteMethodology DB Error]', err.message);
      throw new Error(`Failed to delete methodology from PostgreSQL: ${err.message}`);
    }

    await this.logAudit('DELETE', id, actor, { before: existing });
    return true;
  }
}
