export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch failed: ${res.status} - ${text}`);
  }

  return res.json();
}