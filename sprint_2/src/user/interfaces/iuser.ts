import { IHashSalt } from '../../shared/auth/ihash-salt';

export interface IUser {
    id: string;
    login: string;
    password: IHashSalt;
    age: number;
    isDeleted: boolean;
}
