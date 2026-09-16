// Pure notification calculation and scheduling logic tests

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getNextAvailableDate(
  hour: number,
  minute: number,
  existingDates: Date[],
  mockNow: Date
): Date {
  const now = new Date(mockNow);
  let candidate = new Date(now);
  candidate.setHours(hour, minute, 0, 0);

  if (candidate <= now) {
    candidate.setDate(candidate.getDate() + 1);
  }

  if (existingDates.length > 0) {
    const latest = new Date(Math.max(...existingDates.map((d) => d.getTime())));
    const dayAfterLatest = new Date(latest);
    dayAfterLatest.setDate(dayAfterLatest.getDate() + 1);
    dayAfterLatest.setHours(hour, minute, 0, 0);

    if (dayAfterLatest > candidate) {
      candidate = dayAfterLatest;
    }
  }

  return candidate;
}

describe("notification helpers (pure logic)", () => {
  describe("shuffleArray", () => {
    it("returns an array with the exact same elements", () => {
      const original = ["one", "two", "three", "four", "five"];
      const result = shuffleArray(original);

      expect(result).toHaveLength(original.length);
      expect(result.sort()).toEqual([...original].sort());
    });

    it("does not mutate the original array", () => {
      const original = ["a", "b", "c"];
      const frozen = Object.freeze([...original]);
      expect(() => shuffleArray(frozen as any)).not.toThrow();
    });

    it("handles empty array and single item array", () => {
      expect(shuffleArray([])).toEqual([]);
      expect(shuffleArray([42])).toEqual([42]);
    });
  });

  describe("getNextAvailableDate", () => {
    it("schedules for later today if target time has not passed", () => {
      const mockNow = new Date("2026-09-16T10:00:00");
      const targetHour = 14;
      const targetMinute = 30;

      const next = getNextAvailableDate(targetHour, targetMinute, [], mockNow);

      expect(next.getDate()).toBe(16);
      expect(next.getHours()).toBe(14);
      expect(next.getMinutes()).toBe(30);
    });

    it("schedules for tomorrow if target time has already passed today", () => {
      const mockNow = new Date("2026-09-16T18:00:00");
      const targetHour = 9;
      const targetMinute = 0;

      const next = getNextAvailableDate(targetHour, targetMinute, [], mockNow);

      expect(next.getDate()).toBe(17);
      expect(next.getHours()).toBe(9);
      expect(next.getMinutes()).toBe(0);
    });

    it("schedules the day after the latest existing notification when list is non-empty", () => {
      const mockNow = new Date("2026-09-16T10:00:00");
      const existingDate1 = new Date("2026-09-17T09:00:00");
      const existingDate2 = new Date("2026-09-19T09:00:00");

      const next = getNextAvailableDate(
        9,
        0,
        [existingDate1, existingDate2],
        mockNow
      );

      // Latest existing is Sept 19, so next available is Sept 20
      expect(next.getDate()).toBe(20);
      expect(next.getHours()).toBe(9);
      expect(next.getMinutes()).toBe(0);
    });
  });
});
