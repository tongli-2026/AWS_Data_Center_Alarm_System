export function fetchAlarms(): Promise<unknown[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: "alarm-001",
                    severity: "UNKNOWN",
                    location: {
                        dataCenter: "SEA-01",
                        rackId: "R22",
                        serverId: "S103"
                    },
                    message: "Server status update",
                    timestamp: "2026-11-10T10:30:00Z"
                },
                {
                    id: "alarm-002",
                    severity: "WARNING",
                    location: {
                        dataCenter: "SEA-02",
                        rackId: "R12",
                        serverId: "S203"
                    },
                    message: "  Server status update  ",
                    timestamp: "2026-11-10T02:30:00Z"
                },
                {
                    id: "alarm-003",
                    severity: "CRITICAL",
                    location: {
                        dataCenter: "SEA-03",
                        rackId: "",
                        serverId: "S303"
                    },
                    message: "Server overheats",
                    timestamp: "2026-11-10T05:30:00Z"
                }
            ]);
        }, 500);
    });
}