// src/interfaces/auth.ts
export interface UserData {
    uid: string;
    routeNumber: string;
    email: string;
}

export interface LoginScreenProps {
    onLoginSuccess: (userData: UserData) => void;
}
