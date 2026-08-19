export const getClaimedHandles = () => {
  if (typeof window === "undefined") return [];
  try {
    const item = localStorage.getItem("claimedHandles");
    if (!item) return [];
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (h) => typeof h === "string" && h.trim().length > 0
      );
    }
    return [];
  } catch (error) {
    console.error("Error reading claimedHandles from localStorage:", error);
    return [];
  }
};

export const saveClaimedHandle = (handle) => {
  if (typeof window === "undefined" || !handle) return;
  try {
    const trimmed = handle.trim();
    if (!trimmed) return;
    const current = getClaimedHandles();
    if (!current.includes(trimmed)) {
      const updated = [...current, trimmed];
      localStorage.setItem("claimedHandles", JSON.stringify(updated));
    }
  } catch (error) {
    console.error("Error saving claimedHandle to localStorage:", error);
  }
};

export const removeClaimedHandle = (handle) => {
  if (typeof window === "undefined" || !handle) return;
  try {
    const current = getClaimedHandles();
    const updated = current.filter((h) => h !== handle);
    localStorage.setItem("claimedHandles", JSON.stringify(updated));
  } catch (error) {
    console.error("Error removing claimedHandle from localStorage:", error);
  }
};
