import {v4 as uuidv4} from 'uuid';
export class UUid {
    static v4 = () => uuidv4();
    // static v4(){ lo mismo que la linea de arriba
    //     return uuidv4();
    // }
}