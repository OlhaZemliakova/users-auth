export type LoginFormData = {
    username: string;
    password: string;
};

export type RegisterFormData = {
    username: string;
    name: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
};

export type GetMe = {
    id: string;
    username: string;
};