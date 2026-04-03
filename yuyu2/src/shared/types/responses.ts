export interface response {
    code:string;
    success:boolean;
}

export interface withToken extends response {
    token: string | null
}

export interface withUserData extends response{
    data:{userName:string, email:string, id:string, verified:boolean}
}

export interface withUrl extends response{
    url:string;
}