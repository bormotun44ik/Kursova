const BUILD_KEY = process.env.NEXT_PUBLIC_GROQ_KEY || "";

export function getGroqKey(): string {
  if (typeof window === "undefined") return BUILD_KEY;
  const params = new URLSearchParams(window.location.search);
  return params.get("k") || localStorage.getItem("groq_key") || BUILD_KEY;
}

export function setGroqKey(key: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("groq_key", key);
  }
}
