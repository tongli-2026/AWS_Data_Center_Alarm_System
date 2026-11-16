/**
 * AWS Alarm Event Parser
 */

// Step 1: Define your types
type AlarmSeverity = "INFO" | "WARNING"| "CRITICAL";

interface Location {
    dataCenter: string;
    rackId: string;
    serverId: string;
}

interface AlarmEvent {
    id: string;
    severity: AlarmSeverity;
    location: Location;
    message: string;
    timestamp: string;
}

// Step 2: Implement the parser

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

function parseAlarm(input: unknown): AlarmEvent {
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


// Step 3: Create test cases
const baseAlarm = {
  id: "alarm-001",
  severity: "INFO",
  location: {
    dataCenter: "SEA-01",
    rackId: "R22",
    serverId: "S103"
  },
  message: "Server status update",
  timestamp: "2026-11-10T10:30:00Z"
};

const { id, ...alarmWithoutId } = baseAlarm;

const testAlarms: unknown[] = [
  // TODO: Add 14 test cases
  // Test 1: Valid INFO alarm - PASS
  { ...baseAlarm },

  // Test 2: Valid WARNING alarm - PASS
  { ...baseAlarm, id: "alarm-002",  severity: "WARNING" },

  // Test 3: Valid CRITICAL alarm - PASS
  { ...baseAlarm, id: "alarm-003",  severity: "CRITICAL" },

  // Test 4: Valid alarm from a different server - PASS
  { ...baseAlarm, 
    id: "alarm-004", 
    location:{
        dataCenter: "SEA-02",
        rackId: "R10",
        serverId: "S204"
    }
  },

  // Test 5: Invalid severity "UNKNOWN" - REJECT
  { ...baseAlarm, id: "alarm-005",  severity: "UNKNOWN" },

  // Test 6: Missing id - REJECT
  // { ...baseAlarm, id: undefined },
  alarmWithoutId,

  // Test 7: Missing location.rackId - REJECT
  { ...baseAlarm,
    id: "alarm-007", 
    location:{
        dataCenter: "SEA-03",
        serverId: "S204"
    }
   },

  // Test 8: Invalid timestamp "invalid-date" - REJECT
  { ...baseAlarm, id: "alarm-008", timestamp: "xxxx-xxxx" },

  // Test 9: Root input is null - REJECT
  null,

  // Test 10: Root input is an array - REJECT
  [],

  // Test 11: Root input is a string - REJECT
  "hello",

  // Test 12: Location is null - REJECT
  { ...baseAlarm, id: "alarm-012", location: null },

  // Test 13: ID contains only whitespace - REJECT
  { ...baseAlarm, id: "   " },

  // Test 14: ID contains surrounding whitespace - PASS
  { ...baseAlarm, id: "  alarm-014  " }

];


// Step 4: Run tests
const expectedValid: boolean[] = [
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true
];

let passed = 0;

// TODO: Test all 14 cases and print results
testAlarms.forEach(
    (rawAlarm, index) => {
        const shouldBeValid = expectedValid[index];

        try {
            const alarm = parseAlarm(rawAlarm);

            if (shouldBeValid) {
                if (index === 13 && alarm.id !== "alarm-014") {
                    console.log(`Test 14: FAIL - ID was not trimmed correctly. Got: "${alarm.id}"`);
                } else {
                    console.log(`Test ${index + 1}: PASS`);
                    passed++;
                }
                
            } else {
                console.log(`Test ${index + 1}: FAIL - Expected rejection`);
            }
        } catch (error) {
            if (!shouldBeValid) {
                console.log(`Test ${index + 1}: PASS - Correctly rejected`);
                passed++;
            } else {
                console.log(`Test ${index + 1}: FAIL - Unexpected error`, error);
            }
        }
    }
);

console.log(`${passed}/${testAlarms.length} tests passed`);


