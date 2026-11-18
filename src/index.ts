import type { AlarmEvent } from "./types.js";
import { parseAlarm } from "./alarmParser.js";
import { AlarmNormalizer } from "./alarmNormalizer.js";
import { fetchAlarms } from "./alarmService.js";
import type { Result } from "./results.js";

const alarms = await fetchAlarms();
const results: Result<AlarmEvent>[] = [];
const normalizer = new AlarmNormalizer();

alarms.forEach(
    (raw) => {
        try {
            const parsedAlarm = parseAlarm(raw);
            const normalizedAlarm = normalizer.normalize(parsedAlarm);
            results.push({ success: true, data: normalizedAlarm });
        } catch (error) {
            results.push({success: false, error: error instanceof Error? error.message : String(error)});
        }
    }
);

console.log(results.length);
console.log(JSON.stringify(results, null, 2));
