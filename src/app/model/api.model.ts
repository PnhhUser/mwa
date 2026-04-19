export interface ApiResponseModel<T> {
  data: T | null;
  message: string;
  success: boolean;
}
