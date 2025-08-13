import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      data: {
        name: string;
        email: string;
        user_id: number;
        token: string;
      };
      message: string;
      status_code: number;
      accessToken?: string;
    };
  }

  interface User {
    id: string;
    data: {
      name: string;
      email: string;
      user_id: number;
      token: string;
    };
    message: string;
    status_code: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    data: {
      name: string;
      email: string;
      user_id: number;
      token: string;
    };
    message: string;
    status_code: number;
    accessToken?: string;
  }
}