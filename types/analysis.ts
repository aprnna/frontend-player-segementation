// types/analysis.ts
export interface AnalysisJobStatus {
  status: "started" | "processing" | "completed" | "failed" | "cancelled";
  progress: number;
  message: string;
  created_at: string;
  result?: any;
  error?: string;
}

export interface AnalysisResponse {
  status_code: number;
  message: string;
  data: {
    job_id: string;
    status: string;
    message: string;
    check_url: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}