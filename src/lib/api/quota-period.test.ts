import assert from "node:assert/strict";
import { test } from "node:test";

import { freeQuotaPeriod, paidQuotaPeriod } from "./quota-period";

test("free quota expires at the next UTC month boundary", () => {
  assert.deepEqual(freeQuotaPeriod(new Date("2026-09-29T23:59:59.000Z")), {
    period: "2026-09",
    expiresAt: Date.parse("2026-10-01T00:00:00.000Z") / 1000,
  });
});

test("free quota handles December rollover", () => {
  assert.deepEqual(freeQuotaPeriod(new Date("2026-12-15T12:00:00.000Z")), {
    period: "2026-12",
    expiresAt: Date.parse("2027-01-01T00:00:00.000Z") / 1000,
  });
});

test("paid quota survives periods longer than forty days", () => {
  assert.deepEqual(paidQuotaPeriod("2026-09-01", "2026-11-15"), {
    period: "2026-09-01",
    expiresAt: Date.parse("2026-11-16T00:00:00.000Z") / 1000,
  });
});

test("paid quota rejects invalid date ranges", () => {
  assert.throws(
    () => paidQuotaPeriod("2026-09-01", "2026-09-01"),
    /end must be after its start/
  );
});
