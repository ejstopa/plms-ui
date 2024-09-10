import { Department } from "./department";

export interface UserRole {
    id: number;
    name:string;
    departments: Department[];
}
