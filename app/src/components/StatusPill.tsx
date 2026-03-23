type StatusPillProps = {
  status: string;
};

const colorByStatus: Record<string, string> = {
  RECEIVED: "status-chip-strong",
  ACKNOWLEDGED: "status-chip",
  CONFIRMED: "status-chip-strong",
  BAKING: "status-chip",
  READY: "status-chip-strong",
  COMPLETED: "status-chip-strong",
  CANCELLED: "status-chip",
  STANDARD: "status-chip",
  CUSTOM: "status-chip-strong",
  UNPAID: "status-chip",
  PENDING: "status-chip",
  PAID: "status-chip-strong",
  FAILED: "status-chip-strong",
};

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span className={`inline-flex px-3 py-1 text-xs font-semibold ${colorByStatus[status] || "status-chip"}`}>
      {status}
    </span>
  );
}
