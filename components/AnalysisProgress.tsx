import React from "react";
import { AnalysisJobStatus } from "@/types/analysis";

interface AnalysisProgressProps {
  status: AnalysisJobStatus;
  onReset: () => void;
  onComplete?: (result: any) => void;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  status,
  onReset,
  onComplete,
}) => {
  const getStatusColor = () => {
    switch (status.status) {
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "processing":
        return "text-blue-600";
      case "started":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case "completed":
        return "✅";
      case "failed":
        return "❌";
      case "processing":
        return "⏳";
      case "started":
        return "🚀";
      default:
        return "🔄";
    }
  };

  const getProgressValue = () => {
    // Ensure we have a valid progress value
    if (typeof status.progress === "number") {
      return Math.max(0, Math.min(100, status.progress));
    }

    // Default progress based on status
    switch (status.status) {
      case "started":
        return 5;
      case "processing":
        return 50;
      case "completed":
        return 100;
      case "failed":
        return 0;
      default:
        return 0;
    }
  };

  const isInProgress = ["started", "processing"].includes(status.status);
  const progressValue = getProgressValue();

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="text-center">
        <div className={`text-3xl ${getStatusColor()} mb-2`}>
          {getStatusIcon()}
        </div>
        <h3 className={`text-xl font-semibold ${getStatusColor()}`}>
          {status.status.toUpperCase()}
        </h3>
        <p className="text-gray-600 mt-2">
          {status.message || "Processing your request..."}
        </p>
      </div>
      {/* Progress Bar - Show for in-progress states */}
      {isInProgress && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-blue-600 h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-white text-sm font-medium"
              style={{ width: `${progressValue}%` }}
            >
              {progressValue > 20 && `${progressValue}%`}
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{progressValue}%</span>
          </div>
        </div>
      )}
      {/* Processing Animation */}
      {isInProgress && (
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
          <span className="text-sm">Analyzing...</span>
        </div>
      )}
      {/* Success Results */}
      {status.status === "completed" && status.result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-bold text-green-800 mb-3 flex items-center">
            <span className="mr-2">🎉</span>
            Analysis Completed Successfully!
          </h4>
          {/* <div className="bg-white p-3 rounded border max-h-60 overflow-auto">
            <pre className="text-sm text-gray-700">
              {JSON.stringify(status.result, null, 2)}
            </pre>
          </div> */}
          <button
            onClick={() => onComplete?.(status.result)}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            View Detailed Results
          </button>
        </div>
      )}
      {/* Error Display */}
      {status.status === "failed" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-bold text-red-800 mb-2 flex items-center">
            <span className="mr-2">💥</span>
            Analysis Failed
          </h4>
          <p className="text-red-700">
            {status.error || status.message || "An unknown error occurred"}
          </p>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-4">
        {status.status != "processing" && (
          <button
            onClick={onReset}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            {status.status === "completed" || status.status === "failed"
              ? "Start New Analysis"
              : "Cancel"}
          </button>
        )}

        {/* Show timestamp if available */}
        {status.created_at && (
          <div className="text-xs text-gray-500 self-center">
            Started: {new Date(status.created_at).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};
