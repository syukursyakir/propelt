import type {
  Application,
  CandidateProfile,
  GenerateApplicationRequest,
  Resume,
} from "@propelt/shared";
import { supabase } from "./supabase";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ??
  "http://localhost:4000";

const getAccessToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
};

const apiFetch = async <T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> => {
  const token = options.auth === false ? undefined : await getAccessToken();
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("content-type", "application/json");
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${backendUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(error?.error ?? `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const api = {
  getProfile: () =>
    apiFetch<{ profile: CandidateProfile | null }>("/api/profile"),
  saveProfile: (profile: CandidateProfile) =>
    apiFetch<{ profile: CandidateProfile }>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    }),
  parseResume: (formData: FormData) =>
    apiFetch<{ content: string }>("/api/resumes/parse", {
      method: "POST",
      body: formData,
    }),
  listResumes: () => apiFetch<{ resumes: Resume[] }>("/api/resumes"),
  createResume: (payload: { title: string; content: string }) =>
    apiFetch<{ resume: Resume }>("/api/resumes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteResume: (id: string) =>
    apiFetch<void>(`/api/resumes/${id}`, { method: "DELETE" }),
  listApplications: () =>
    apiFetch<{ applications: Application[] }>("/api/applications"),
  getApplication: (id: string) =>
    apiFetch<{ application: Application }>(`/api/applications/${id}`),
  generateApplication: (payload: GenerateApplicationRequest) =>
    apiFetch<{ application: Application }>("/api/applications/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateApplicationResult: (
    id: string,
    result: Application["result"],
  ) =>
    apiFetch<{ application: Application }>(`/api/applications/${id}/result`, {
      method: "PATCH",
      body: JSON.stringify({ result }),
    }),
  deleteApplication: (id: string) =>
    apiFetch<void>(`/api/applications/${id}`, { method: "DELETE" }),
};
