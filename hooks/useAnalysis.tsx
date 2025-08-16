// Fixed AnalysisAPI and useAnalysis hook
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import fetchApi from "@/utils/fetchApi";
import { AnalysisJobStatus, AnalysisResponse } from "@/types/analysis";

export class AnalysisAPI {
  // Start background analysis
  static async startAnalysis(
    steamIds?: string[],
    files?: File[]
  ): Promise<AnalysisResponse> {
    const formData = new FormData();

    // Steam IDs are optional - only add if provided
    if (steamIds && steamIds.length > 0) {
      formData.append("steam_ids", steamIds.join(", "));
    }

    // Files are optional - only add if provided
    if (files && files.length > 0) {
      formData.append("file", files[0]); // Backend expects single file with key "file"
    }

    const response = await fetchApi("/analyze/full_steam", "POST", formData);
    return response;
  }

  // Check job status
  static async checkStatus(jobId: string): Promise<{
    status_code: number;
    data: AnalysisJobStatus;
    message?: string;
  }> {
    const response = await fetchApi(`/analyze/status/${jobId}`, "GET");
    // Response structure should match your Flask Response.success format
    return {
      status_code: response.status_code,
      data: response.data,
      message: response.message,
    };
  }
  // Stop analysis
  static async stopAnalysis(
    jobId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    const response = await fetchApi(`/analyze/stop/${jobId}`, "POST");
    return {
      success: response.success,
      message: response.message,
      data: response.data,
    };
  }
}

export const useAnalysis = () => {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisJobStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start analysis
  const startAnalysis = useCallback(
    async (steamIds?: string[], files?: File[]) => {
      try {
        setIsLoading(true);
        setError(null);
        setStatus(null); // Clear previous status
        setJobId(null); // Clear previous job ID

        console.log("🚀 Starting analysis...", { steamIds, files });
        const response = await AnalysisAPI.startAnalysis(steamIds, files);
        console.log("📡 Full start analysis response:", response);

        // Check if response has the expected structure
        if (response && response.data && response.data.job_id) {
          const newJobId = response.data.job_id;
          setJobId(newJobId);
          setStatus({
            status: "started",
            progress: 0,
            message:
              response.data.message || response.message || "Analysis started",
            created_at: new Date().toISOString(),
          });

          console.log("✅ Analysis started successfully, job ID:", newJobId);
        } else {
          console.error("❌ Unexpected response structure:", response);
          setError("Failed to start analysis - invalid response format");
        }
      } catch (err: any) {
        console.error("❌ Start analysis error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to start analysis"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Poll for status updates
  const pollStatus = useCallback(async (jobId: string) => {
    try {
      console.log("🔄 Polling status for job:", jobId);
      const response = await AnalysisAPI.checkStatus(jobId);
      console.log("📊 Status response:", response);

      if (response.status_code === 200) {
        setStatus(response.data);

        // Stop polling if completed or failed
        if (["completed", "failed"].includes(response.data.status)) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          console.log(
            "🏁 Polling stopped, final status:",
            response.data.status
          );
        }
      } else {
        console.error("❌ Status check failed:", response.message);
        setError(response.message || "Status check failed");
      }
    } catch (err: any) {
      console.error("❌ Status check error:", err);
      setError(
        err.response?.data?.message || err.message || "Status check failed"
      );

      // Stop polling on error
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, []);

  // Start polling when jobId is set
  useEffect(() => {
    console.log("🔄 useEffect for jobId:", jobId);
    if (jobId && !intervalRef.current) {
      console.log("🔄 Starting polling for job:", jobId);

      // Initial status check
      pollStatus(jobId);

      // Poll every 2 seconds
      intervalRef.current = setInterval(() => {
        pollStatus(jobId);
      }, 2000);
    }

    return () => {
      if (intervalRef.current) {
        console.log("🛑 Cleaning up polling interval");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [jobId, pollStatus]);

  const stopAnalysis = useCallback(async () => {
    if (!jobId) {
      console.warn("No job ID to stop");
      return;
    }

    try {
      console.log("🛑 Stopping analysis for job:", jobId);
      const response = await AnalysisAPI.stopAnalysis(jobId);

      if (response.success) {
        console.log("✅ Stop signal sent successfully");
        // The status will be updated through polling
      } else {
        setError(response.message || "Failed to stop analysis");
      }
    } catch (err: any) {
      console.error("❌ Stop analysis error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to stop analysis"
      );
    }
  }, [jobId]);

  // Reset function
  const reset = useCallback(() => {
    console.log("🔄 Resetting analysis state");
    setJobId(null);
    setStatus(null);
    setError(null);
    setIsLoading(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  // Check if analysis can be stopped
  const canStop = useMemo(() => {
    return status && ["started", "processing"].includes(status.status);
  }, [status]);

  return {
    jobId,
    status,
    isLoading,
    error,
    startAnalysis,
    reset,
    canStop,
    stopAnalysis,
  };
};
