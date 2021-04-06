export interface IResponseUserDto {
    id: string;
    login: string;
    age: number;
}

export interface ICreateUserDto {
    login: string;
    age: number;
    password: string;
}

export interface IUpdateUserDto extends Partial<ICreateUserDto> {
    id: string;
}
