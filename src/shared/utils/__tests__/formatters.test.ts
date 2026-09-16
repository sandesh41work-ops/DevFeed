// Formatters and string/time helpers unit tests

// Helper mirrors the pure logic defined in StoryCard.tsx
const getDomain = (url?: string) => {
  try {
    return url
      ? new URL(url).hostname.replace("www.", "")
      : "news.ycombinator.com";
  } catch {
    return "news.ycombinator.com";
  }
};

const getTimeAgo = (unixTime: number, mockNowSeconds?: number) => {
  const now = mockNowSeconds ?? Math.floor(Date.now() / 1000);
  const diff = now - unixTime;
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

// Helper mirrors the pure logic defined in ProfileScreen.tsx
const getInitials = (name?: string | null) => {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

describe("formatters & pure utilities", () => {
  describe("getDomain", () => {
    it("extracts hostname from standard HTTP/HTTPS URLs", () => {
      expect(getDomain("https://github.com/facebook/react")).toBe("github.com");
      expect(getDomain("http://example.com/test?a=1")).toBe("example.com");
    });

    it("strips 'www.' prefix from hostnames", () => {
      expect(getDomain("https://www.nytimes.com/article")).toBe("nytimes.com");
      expect(getDomain("http://www.theverge.com/")).toBe("theverge.com");
    });

    it("defaults to 'news.ycombinator.com' for undefined or empty URLs (e.g. Ask HN)", () => {
      expect(getDomain(undefined)).toBe("news.ycombinator.com");
      expect(getDomain("")).toBe("news.ycombinator.com");
    });

    it("defaults to 'news.ycombinator.com' for invalid or malformed URLs", () => {
      expect(getDomain("not-a-valid-url")).toBe("news.ycombinator.com");
      expect(getDomain("http://")).toBe("news.ycombinator.com");
    });
  });

  describe("getTimeAgo", () => {
    const fixedNow = 1700000000;

    it("formats seconds ago (< 60s)", () => {
      expect(getTimeAgo(fixedNow - 15, fixedNow)).toBe("15s");
      expect(getTimeAgo(fixedNow - 59, fixedNow)).toBe("59s");
    });

    it("formats minutes ago (< 3600s)", () => {
      expect(getTimeAgo(fixedNow - 60, fixedNow)).toBe("1m");
      expect(getTimeAgo(fixedNow - 180, fixedNow)).toBe("3m");
      expect(getTimeAgo(fixedNow - 3599, fixedNow)).toBe("59m");
    });

    it("formats hours ago (< 86400s)", () => {
      expect(getTimeAgo(fixedNow - 3600, fixedNow)).toBe("1h");
      expect(getTimeAgo(fixedNow - 7200, fixedNow)).toBe("2h");
      expect(getTimeAgo(fixedNow - 86399, fixedNow)).toBe("23h");
    });

    it("formats days ago (>= 86400s)", () => {
      expect(getTimeAgo(fixedNow - 86400, fixedNow)).toBe("1d");
      expect(getTimeAgo(fixedNow - 86400 * 5, fixedNow)).toBe("5d");
      expect(getTimeAgo(fixedNow - 86400 * 30, fixedNow)).toBe("30d");
    });
  });

  describe("getInitials", () => {
    it("returns '?' when name is empty, undefined, null, or whitespace", () => {
      expect(getInitials(undefined)).toBe("?");
      expect(getInitials(null)).toBe("?");
      expect(getInitials("")).toBe("?");
      expect(getInitials("   ")).toBe("?");
    });

    it("returns single letter for single name", () => {
      expect(getInitials("Alice")).toBe("A");
      expect(getInitials("bob")).toBe("B");
    });

    it("returns first and last letter for multi-part names", () => {
      expect(getInitials("John Doe")).toBe("JD");
      expect(getInitials("Sandesh Kumar Sharma")).toBe("SS");
    });

    it("handles multiple spaces between names", () => {
      expect(getInitials("  Linus    Torvalds  ")).toBe("LT");
    });
  });
});
