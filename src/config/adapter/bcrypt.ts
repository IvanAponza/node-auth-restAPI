import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

//Como clase
export class Bcrypt {
    //Encrypta el password
    static hash = (password: string) => {
        const salt = genSaltSync();
        return hashSync(password, salt)
    };

    //Compara password
    static compare = (password: string, hashed: string) => {
        return compareSync(password, hashed);
    }
}

//como Objeto
// export const Bcrypt = {©
//     //Encrypta el password
//     hash: (password: string) => {
//         const salt = genSaltSync();
//         return hashSync(password, salt)
//     },

//     //Compara password
//     compare: (password: string, hashed: string) => {
//         return compareSync(password, hashed);
//     }
// }