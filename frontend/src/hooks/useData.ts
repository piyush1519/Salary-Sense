import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PredictInput, PredictionResult, ModelPoolMeta, ShapResult } from "@/types";

/** Fetch model pool metadata */
export function useModelPool() {
  return useQuery<ModelPoolMeta>({
    queryKey: ["model-pool"],
    queryFn: () => api.get("/models/pool").then((r) => r.data),
    staleTime: Infinity,
  });
}

/** Predict salary with best model */
export function usePrediction() {
  return useMutation<PredictionResult, Error, PredictInput>({
    mutationFn: (input) => api.post("/predict", input).then((r) => r.data),
  });
}

/** Predict with all models */
export function usePredictAllModels() {
  return useMutation({
    mutationFn: (input: PredictInput) =>
      api.post("/predict/all-models", input).then((r) => r.data),
  });
}

/** SHAP explanation for a given input */
export function useShapExplanation() {
  return useMutation<ShapResult, Error, PredictInput>({
    mutationFn: (input) => api.post("/explain/shap", input).then((r) => r.data),
  });
}

/** Salary trend hook — generic */
export function useTrend(key: string) {
  return useQuery({
    queryKey: ["trends", key],
    queryFn: () => api.get(`/trends/${key}`).then((r) => r.data.data ?? []),
    staleTime: 10 * 60 * 1000,
  });
}

/** Market skill demand */
export function useMarketSkills() {
  return useQuery({
    queryKey: ["market-skills"],
    queryFn: () => api.get("/skill-gap/market-skills").then((r) => r.data.data ?? []),
    staleTime: 10 * 60 * 1000,
  });
}
