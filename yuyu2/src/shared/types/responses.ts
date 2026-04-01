export interface response {
    code:string;
    success:boolean;
}

export interface withToken extends response {
    token: string | null
}
//{"userName":user[0]["userName"], "email":user[0]["email"], "id":user[0]["id"], "verified":user[0]["verified"]}
export interface withUserData extends response{
    data:{userName:string, email:string, id:string, verified:boolean}
}