import axios from "axios";
import { getSession } from "next-auth/react";

export default async function fetchApi(
  path: string,
  method: string,
  body?: any,
  customHeaders?: Record<string, string>
) {
  const session = await getSession();
  const token = session?.user?.data?.token;

  const url = process.env.NEXT_PUBLIC_API_URL + path;
  
  // Default headers
  const headers: Record<string, string> = {};
  
  // Set Content-Type based on body type
  if (body instanceof FormData) {
    // Untuk FormData, jangan set Content-Type - biarkan axios handle
    console.log("Detected FormData, letting axios handle Content-Type");
  } else {
    // Untuk data biasa, gunakan JSON
    headers["Content-Type"] = "application/json";
  }
  
  // Add authorization header
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Merge custom headers
  if (customHeaders) {
    Object.assign(headers, customHeaders);
  }

  const options: any = {
    method,
    url,
    headers,
  };

  // Handle body based on type
  if (body) {
    if (body instanceof FormData) {
      // Untuk FormData, kirim langsung tanpa stringify
      options.data = body;
      console.log("Sending FormData:");
    } else {
      // Untuk object biasa, stringify sebagai JSON
      options.data = JSON.stringify(body);
    }
  }

  try {
    console.log("Axios request options:", {
      ...options,
      data: body instanceof FormData ? '[FormData]' : options.data
    });
    
    const response = await axios(options);
    
    return response.data;
  } catch (error: any) {
    console.log("Axios error:", error);
    console.log("Error response:", error.response?.data);
    
    // Return a standardized error object for the frontend to use
    const backendError = error.response?.data || {
      message: 'Unknown error occurred',
      status: error.response?.status || 500,
    };

    throw new Error(backendError.message || 'Error during API call');
  }
}