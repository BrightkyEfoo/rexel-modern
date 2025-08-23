import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      phone: string;
      type: string;
      isEmailVerified: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    phone: string;
    type: string;
    isEmailVerified: boolean;
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    type: string;
    isEmailVerified: boolean;
  }
}
