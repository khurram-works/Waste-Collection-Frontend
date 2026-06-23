const BASE_URL = "http://localhost:3000";

let refreshPromise: Promise<void> | null = null;

async function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            (data as { error?: string }).error || "Session expired"
          );
        }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}


export async function publicApiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Request failed");
  }

  return data;
}


export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const makeRequest = () =>
    fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

  let response = await makeRequest();

  if (response.status === 401) {
    await refreshSession();
    response = await makeRequest();
  }

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error(data?.error || "Session expired");
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Request failed");
  }

  return data;
}

export { BASE_URL };