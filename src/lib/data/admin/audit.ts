import { AuditLog } from "./types";

export async function fetchAuditLogs(
  _filters?: {
    actor?: string;
    action?: string;
    entity?: string;
    from?: Date;
    to?: Date;
  },
  _pagination: { page: number; pageSize: number } = { page: 1, pageSize: 20 }
): Promise<{ data: AuditLog[]; total: number }> {
  // Placeholder - would need audit_logs table
  // For now, return empty array
  return {
    data: [],
    total: 0,
  };
}

export async function createAuditLog(
  actor: string,
  action: string,
  entity: string,
  entityId: string,
  metadata?: Record<string, unknown>
): Promise<AuditLog> {
  // Placeholder - would insert into audit_logs table
  return {
    id: crypto.randomUUID(),
    actor,
    actorEmail: "",
    action,
    entity,
    entityId,
    timestamp: new Date().toISOString(),
    metadata: metadata || {},
  };
}
