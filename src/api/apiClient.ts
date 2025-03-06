import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, isCancel as axiosIsCancel } from 'axios';

const BASE_URL = 'http://localhost:5001';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

interface CacheData {
  data: any;
  timestamp: number;
  expiresIn: number;
}

class ApiCache {
  private cache: Record<string, CacheData> = {};
  private readonly DEFAULT_CACHE_TIME = 5 * 60 * 1000;

  get(key: string): any | null {
    const cachedData = this.cache[key];
    
    if (!cachedData) return null;
    
    const now = Date.now();
    if (now - cachedData.timestamp > cachedData.expiresIn) {
      this.delete(key);
      return null;
    }
    
    return cachedData.data;
  }

  set(key: string, data: any, expiresIn: number = this.DEFAULT_CACHE_TIME): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      expiresIn
    };
  }

  delete(key: string): void {
    delete this.cache[key];
  }

  clear(): void {
    this.cache = {};
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

const apiCache = new ApiCache();

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface UserData {
  id: number;
  email: string;
  fullname: string;
  token: string;
}

export interface AuthorData {
  authorId: number;
  name: string;
}

export interface QuoteData {
  quote: string;
}

export interface InfoData {
  info: string;
}

async function cachedRequest<T>(
  cacheKey: string,
  requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>,
  options: { forceRefresh?: boolean; cacheTime?: number } = {}
): Promise<ApiResponse<T>> {
  const { forceRefresh = false, cacheTime } = options;
  
  if (!forceRefresh && apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }
  
  const response = await requestFn();
  const responseData = response.data;
  
  if (responseData.success) {
    apiCache.set(cacheKey, responseData, cacheTime);
  }
  
  return responseData;
}

export const authApi = {
  checkAuth: async (): Promise<ApiResponse<UserData>> => {
    const response = await apiClient.get<ApiResponse<UserData>>('/api/profile');
    return response.data;
  },
  
  login: async (email: string, password: string): Promise<ApiResponse<UserData>> => {
    const response = await apiClient.post<ApiResponse<UserData>>('/api/login', { email, password });
    
    apiCache.clear();
    
    return response.data;
  },
  
  logout: async (): Promise<ApiResponse<{}>> => {
    const response = await apiClient.delete<ApiResponse<{}>>('/api/logout');
    
    apiCache.clear();
    
    return response.data;
  }
};

export const userApi = {
  getProfile: async (options: { forceRefresh?: boolean } = {}): Promise<ApiResponse<UserData>> => {
    return cachedRequest<UserData>(
      'profile',
      () => apiClient.get<ApiResponse<UserData>>('/api/profile'),
      options
    );
  },
  
  getAuthor: async (config?: AxiosRequestConfig): Promise<ApiResponse<AuthorData>> => {
    const response = await apiClient.get<ApiResponse<AuthorData>>('/api/author', config);
    return response.data;
  },
  
  getQuote: async (authorId: number, config?: AxiosRequestConfig): Promise<ApiResponse<QuoteData>> => {
    const response = await apiClient.get<ApiResponse<QuoteData>>(`/api/quote?authorId=${authorId}`, config);
    return response.data;
  }
};

export const infoApi = {
  getInfo: async (options: { forceRefresh?: boolean } = {}): Promise<ApiResponse<InfoData>> => {
    return cachedRequest<InfoData>(
      'info',
      () => apiClient.get<ApiResponse<InfoData>>('/info'),
      { ...options, cacheTime: 10 * 60 * 1000 }
    );
  }
};

export const isCancel = axiosIsCancel;

export const clearCache = () => apiCache.clear();

export default apiClient; 