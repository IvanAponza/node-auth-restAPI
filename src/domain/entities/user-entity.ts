import { CustomError } from "../errors/custom.error";



export class UserEntity {

    constructor(
        public id: string,
        public name: string,
        public email: string,
        public emailValidated: boolean,
        public password: string,
        public roles: string[],
        public img?:string
    ){}

    //ordenar property
    static fromObject( object: {[key: string]: any}){
        const { id, _id, name, email, emailValidated, password, roles, img } = object;

        //Valida cada property
        if(!_id && !id ) throw CustomError.badRequest('Missing ID');
        if(!name ) throw CustomError.badRequest('Missing Name');
        if(!email ) throw CustomError.badRequest('Missing Email');
        if(!emailValidated === undefined ) throw CustomError.badRequest('Missing EmailValidated');
        if(!roles ) throw CustomError.badRequest('Missing Roles');

        //Todo Ok
        return new UserEntity(_id || id, name, email, emailValidated, password, roles, img);
    }
}