export interface response {
    code:string;
    success:boolean;
}

export interface withToken extends response {
    token: string | null
}