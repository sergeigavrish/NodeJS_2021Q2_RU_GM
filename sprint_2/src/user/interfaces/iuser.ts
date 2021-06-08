export interface IUser {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

export type Login = Pick<IUser, 'login' | 'password'>;