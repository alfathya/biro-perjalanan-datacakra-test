export interface RegisterRequestBody {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: "admin" | "employee" | "tourist";
  firstName: string;
  lastName: string;
}
