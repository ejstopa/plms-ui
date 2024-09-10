import { UserRole } from "./user-role";

export interface UserModel {
    id: number;
    name: string;
    password: string;
    windowsUser: string;
    roleId: number;
    isActive: boolean;
    userRole: UserRole;
}
