export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}
