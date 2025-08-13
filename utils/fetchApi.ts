import axios from "axios";
import { getSession } from "next-auth/react";

export default async function fetchApi(
  path: string,
  method: string,
  body?: any,
) {
  const session = await getSession();
  const token = session?.user?.data?.token; // ini sesuai dengan structure yang kamu simpan di jwt callback

  const url = process.env.NEXT_PUBLIC_API_URL + path;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    ...(body && { data: JSON.stringify(body) }),
  };

  try {
    const response = await axios(url, options);
    
    return response.data;
  } catch (error:any) {
    console.log(error);
    // Return a standardized error object for the frontend to use
    const backendError = error.response?.data || {
      message: 'Unknown error occurred',
      status: error.response?.status || 500,
    };

    throw new Error(backendError.message || 'Error during API call');
  }
}
