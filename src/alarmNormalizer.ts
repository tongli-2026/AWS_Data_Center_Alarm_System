import type { AlarmEvent } from "./types.js";

export class AlarmNormalizer {
    normalize(alarm: AlarmEvent): AlarmEvent {
        const id = alarm.id;
        const severity = alarm.severity;
        const location = alarm.location;
        const message = alarm.message;
        const timestamp = new Date(alarm.timestamp).toISOString();

        return {
            id,
            severity,
            location,
            message,
            timestamp
        };
    }
};
