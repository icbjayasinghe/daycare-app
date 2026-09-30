export interface LoginResponse {
  //   token: string;
  //   refreshToken?: string;
  //   expiresIn?: number;
  //   user: {
  //     id: string | number;
  //     name: string;
  //     email: string;
  //     role?: string;
  //   };
  //   message?: string;

  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}
