export type QuotaPeriod = {
  period: string;
  /** Redis EXPIREAT timestamp, in whole Unix seconds. */
  expiresAt: number;
};

const UTC_DAY_MS = 24 * 60 * 60 * 1000;

function parseDateOnly(value: string): number {
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(timestamp)) {
    throw new Error(`Invalid quota period date: ${value}`);
  }
  return timestamp;
}

/**
 * Paid subscription periods currently treat period_end as inclusive, so the
 * counter expires at UTC midnight immediately after that date.
 */
export function paidQuotaPeriod(
  periodStart: string,
  periodEnd: string
): QuotaPeriod {
  const start = parseDateOnly(periodStart);
  const end = parseDateOnly(periodEnd);
  if (end <= start) {
    throw new Error("Quota period end must be after its start");
  }

  return {
    period: periodStart,
    expiresAt: Math.floor((end + UTC_DAY_MS) / 1000),
  };
}

/** Free quota buckets follow UTC calendar months. */
export function freeQuotaPeriod(now = new Date()): QuotaPeriod {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const period = `${year}-${String(month + 1).padStart(2, "0")}`;

  return {
    period,
    expiresAt: Math.floor(Date.UTC(year, month + 1, 1) / 1000),
  };
}
