import type { AlarmSeverity, Location, AlarmEvent } from "./types.js";

// helper for checking if the input is a non-null, non-array object.
function isRecord(value: unknown): value is Record<string, unknown> {
    return (
        typeof value === "object" && value !== null && !Array.isArray(value)
    );
}
// helper for checking if the input is a non-empty string after trimming.
function requireNonEmptyString(value: unknown, field: string): string {
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`Invalid ${field}: expected a non-empty string.`);
    }
    return value.trim();
}

// helper for checking AlarmSeverity
function assertAlarmSeverity(value: unknown): asserts value is AlarmSeverity {
    if (value !== "INFO" && value !== "WARNING" && value !== "CRITICAL") {
        throw new Error("Invalid severity.");
    }
}

export function parseAlarm(input: unknown): AlarmEvent {
  // TODO: Validate input is an object. Must be a non-null, non-array object.
  if (!isRecord(input)) {
    throw new Error("Alarm must be a non-null, non-array object.");
  }

  // TODO: Validate id. Must be a non-empty string after trimming.
  const id = requireNonEmptyString(input.id, "id");

  // TODO: Validate severity. Must be one of the three allowed values.
  assertAlarmSeverity(input.severity);
  const severity = input.severity;

  // TODO: Validate location. Must be a non-null, non-array object.
  if (!isRecord(input.location)) {
    throw new Error("Invalid location.");
  }
  // location.dataCenter, location.rackId, location.serverId must be non-empty strings after trimming.
  const location: Location = {
    dataCenter: requireNonEmptyString(input.location.dataCenter, "dataCenter"),
    rackId: requireNonEmptyString(input.location.rackId, "rackId"),
    serverId: requireNonEmptyString(input.location.serverId, "serverId")
  };

  // TODO: Validate message. Must be a non-empty string after trimming.
  const message = requireNonEmptyString(input.message, "message");

  // TODO: Validate timestamp. Must be a non-empty string after trimming representing a valid date/time.
  const timestamp = requireNonEmptyString(input.timestamp, "timestamp");
  if (Number.isNaN(Date.parse(timestamp))) {
    throw new Error("Invalid timestamp");
  }

  // TODO: Return a valid AlarmEvent.
  return {
    id,
    severity,
    location,
    message,
    timestamp
  };
}