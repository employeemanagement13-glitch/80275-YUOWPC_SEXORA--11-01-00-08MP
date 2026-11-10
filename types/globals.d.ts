// types/globals.d.ts
export type Roles = 'admin' | 'moderator' | 'user';  // define valid roles

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: Roles;
      // you can add other metadata fields here too
    }
  }
}
