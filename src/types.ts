export type AlarmSeverity = "INFO" | "WARNING"| "CRITICAL";

export interface Location {
    dataCenter: string;
    rackId: string;
    serverId: string;
}

export interface AlarmEvent {
    id: string;
    severity: AlarmSeverity;
    location: Location;
    message: string;
    timestamp: string;
}