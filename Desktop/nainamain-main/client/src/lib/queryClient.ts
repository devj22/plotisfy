import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getAuthHeader } from "@/lib/auth";
import { getApiUrl } from "@/config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `${res.status}: ${res.statusText}`;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.error || errorMessage;
      
      // Add additional error details if available
      if (errorData.details) {
        errorMessage += ` - ${errorData.details}`;
      }
    } catch (e) {
      // If JSON parsing fails, use the raw text
      errorMessage = errorText || errorMessage;
    }
    
    const error = new Error(errorMessage);
    (error as any).status = res.status;
    (error as any).response = res;
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  headers?: Record<string, string>
): Promise<any> {
  try {
    // Convert relative API paths to full URLs
    const fullUrl = url.startsWith('http') ? url : getApiUrl(url.replace(/^\/api\//, ''));
    console.log(`API Request - ${method} ${fullUrl}`, { headers, data });
    
    const res = await fetch(fullUrl, {
      method,
      headers: {
        ...(data ? { "Content-Type": "application/json" } : {}),
        ...headers
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    
    // For HEAD or OPTIONS requests, or if no content
    if (method === 'HEAD' || method === 'OPTIONS' || res.status === 204) {
      return null;
    }
    
    // Parse response based on content type
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const jsonData = await res.json();
      console.log(`API Response - ${method} ${url}:`, { status: res.status, data: jsonData });
      return jsonData;
    }
    
    const textData = await res.text();
    console.log(`API Response - ${method} ${url}:`, { status: res.status, data: textData });
    return textData;
  } catch (error) {
    console.error(`API Error - ${method} ${url}:`, {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const authHeader = getAuthHeader();
      const response = await apiRequest(
        'GET',
        queryKey[0] as string,
        undefined,
        authHeader
      );
      
      return response;
    } catch (error) {
      if (unauthorizedBehavior === "returnNull" && error instanceof Error && (error as any).status === 401) {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
