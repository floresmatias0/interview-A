export class User{
    id?:string;
    name:string;
    surname:string;
    genre:string;
    email:string;
    password:string;
    tokens:number;
    publishedTotal?:number;
    constructor(){
        this.tokens = 1000;
    }
}