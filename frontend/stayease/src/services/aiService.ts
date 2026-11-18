import axiosInstance from '../api/axiosInstance';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AiResponse {
  result: string;
  type: 'summary' | 'recommendation' | 'chat' | 'description';
}

export interface SummarizeRequest {
  title: string;
  propertyType: string;
  city: string;
  rent: number;
  amenities: string[];
  description?: string;
}

export interface RecommendParams {
  city?: string;
  propertyType?: string;
  maxRent?: number;
}

// ─── Helper: get role from localStorage (adjust key to match your app) ────────
const getRole = (): string | null =>
  localStorage.getItem('role') || localStorage.getItem('userRole') || null;

// ─── EP1: POST /properties/ai/summarize ──────────────────────────────────────
// Requires X-User-Role header (any role). Used on property cards.
export const summarizeProperty = async (
  req: SummarizeRequest
): Promise<AiResponse> => {
  const role = getRole();
  const res = await axiosInstance.post<AiResponse>('/properties/ai/summarize', req, {
    headers: role ? { 'X-User-Role': role } : {},
  });
  return res.data;
};

// ─── EP2: GET /properties/ai/recommend ───────────────────────────────────────
// Requires X-User-Role: TENANT only.
export const getRecommendations = async (
  params: RecommendParams
): Promise<AiResponse> => {
  const res = await axiosInstance.get<AiResponse>('/properties/ai/recommend', {
    params,
    headers: { 'X-User-Role': 'TENANT' },
  });
  return res.data;
};

// ─── EP3: POST /properties/chat ──────────────────────────────────────────────
// Requires X-User-Role header (any role). Used for chatbot.
export const chatWithAI = async (message: string): Promise<AiResponse> => {
  const role = getRole();
  const res = await axiosInstance.post<AiResponse>('/properties/chat', { message }, {
    headers: role ? { 'X-User-Role': role } : {},
  });
  return res.data;
};

// ─── EP4: GET /properties/describe/{propertyId} ──────────────────────────────
// Requires X-User-Role header (any role).
export const describeProperty = async (
  propertyId: string
): Promise<AiResponse> => {
  const role = getRole();
  const res = await axiosInstance.get<AiResponse>(
    `/properties/describe/${propertyId}`,
    { headers: role ? { 'X-User-Role': role } : {} }
  );
  return res.data;
};