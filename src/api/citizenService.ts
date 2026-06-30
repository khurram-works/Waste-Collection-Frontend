const BASE_URL = import.meta.env.VITE_API_URL

export const submitPickupRequest = async (formData: FormData) => {
  const res = await fetch(`${BASE_URL}/citizen/request`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? err.message ?? "Server error");
  }
  return res.json();
};
