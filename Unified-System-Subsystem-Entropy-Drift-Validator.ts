// Unified-System-Subsystem-Entropy-Drift-Validator.ts
// SAIA-Class 300 — deterministic subsystem entropy drift validator.

export interface EntropyPacket {
  packetId: string;
  engineId: string;
  subsystemId: string;
  entropyMetrics: Record<string, number>;
  timestampIso: string;
}

export type EntropyStatus =
  | "ENTROPY_STABLE"
  | "ENTROPY_DRIFT"
  | "ENTROPY_CRITICAL"
  | "INVALID_METRICS"
  | "TIMESTAMP_ERROR";

export interface EntropyRuling {
  rulingId: string;
  packetId: string;
  status: EntropyStatus;
  details: string;
  issuedAtIso: string;
  issuedByEngineId: string;
}

export interface EntropyValidatorConfig {
  engineId: string;
  driftThreshold: number;
  criticalThreshold: number;
}

export class UnifiedSystemSubsystemEntropyDriftValidator {
  private readonly config: EntropyValidatorConfig;

  constructor(config: EntropyValidatorConfig) {
    this.config = config;
  }

  public evaluate(packet: EntropyPacket): EntropyRuling {
    const status = this.resolveStatus(packet);

    return {
      rulingId: this.generateRulingId(packet),
      packetId: packet.packetId,
      status,
      details: this.describe(status),
      issuedAtIso: new Date().toISOString(),
      issuedByEngineId: this.config.engineId,
    };
  }

  private resolveStatus(packet: EntropyPacket): EntropyStatus {
    if (!packet.timestampIso) return "TIMESTAMP_ERROR";

    if (!packet.entropyMetrics || Object.keys(packet.entropyMetrics).length === 0) {
      return "INVALID_METRICS";
    }

    const score = this.computeEntropyScore(packet.entropyMetrics);

    if (score < this.config.driftThreshold) return "ENTROPY_STABLE";
    if (score < this.config.criticalThreshold) return "ENTROPY_DRIFT";
    return "ENTROPY_CRITICAL";
  }

  private computeEntropyScore(metrics: Record<string, number>): number {
    const values = Object.values(metrics);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return avg;
  }

  private describe(status: EntropyStatus): string {
    switch (status) {
      case "ENTROPY_STABLE":
        return "Subsystem entropy stable; thermodynamic order preserved.";
      case "ENTROPY_DRIFT":
        return "Entropy drift detected; subsystem disorder increasing.";
      case "ENTROPY_CRITICAL":
        return "Critical entropy detected; runaway thermodynamic chaos risk.";
      case "INVALID_METRICS":
        return "Entropy metrics missing or invalid.";
      case "TIMESTAMP_ERROR":
        return "Missing or invalid timestamp.";
    }
  }

  private generateRulingId(packet: EntropyPacket): string {
    return `ENTROPY-${this.config.engineId}-${packet.packetId}-${Date.now()}`;
  }
}

export const DEFAULT_ENTROPY_VALIDATOR_CONFIG: EntropyValidatorConfig = {
  engineId: "Unified-System-Subsystem-Entropy-Drift-Validator-Class-300",
  driftThreshold: 40,
  criticalThreshold: 75,
};
