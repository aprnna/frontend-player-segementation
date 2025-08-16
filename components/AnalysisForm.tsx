import React, { useState } from "react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { AnalysisProgress } from "./AnalysisProgress";

interface AnalysisFormProps {
  onComplete?: (result: any) => void;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onComplete }) => {
  const [steamIds, setSteamIds] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const { status, isLoading, error, startAnalysis, reset } = useAnalysis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input based on selected method
    const steamIdsArray = steamIds.trim()
      ? steamIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [];

    const hasIds = steamIdsArray.length > 0;
    const hasFiles = files.length > 0;

    // Start analysis with optional parameters
    await startAnalysis(
      hasIds ? steamIdsArray : undefined,
      hasFiles ? files : undefined
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Handle completion
  React.useEffect(() => {
    if (status?.status === "completed" && status.result) {
      onComplete?.(status.result);
    }
  }, [status, onComplete]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Steam Analysis</h2>

      {(!status || status.status === "failed") && !isLoading && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Steam IDs Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Steam IDs (comma separated)
              <span className="text-gray-500"></span>
            </label>
            <textarea
              value={steamIds}
              onChange={(e) => setSteamIds(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="76561198184561219, 76561198123456789"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter Steam user IDs separated by commas
            </p>
          </div>
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload File (.csv, .txt)
              <span className="text-gray-500"></span>
            </label>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-green-600">
                  ✅ Selected: {files[0].name} (
                  {(files[0].size / 1024).toFixed(1)} KB)
                </p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Upload a file containing Steam data or reviews
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Starting Analysis...
              </div>
            ) : (
              "Start Analysis"
            )}
          </button>
        </form>
      )}

      {/* Loading State - Show immediately when starting analysis */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Starting analysis...</p>
        </div>
      )}

      {/* Progress Display - Show when we have status and not loading */}
      {status && !isLoading && (
        <AnalysisProgress
          status={status}
          onReset={reset}
          onComplete={onComplete}
        />
      )}

      {/* Error Display - Only show errors that are not related to status */}
      {error && !status && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <h4 className="font-bold">Error:</h4>
          <p>{error}</p>
          <button
            onClick={reset}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
