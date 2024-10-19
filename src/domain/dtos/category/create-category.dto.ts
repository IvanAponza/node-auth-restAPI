import { validations } from "../../../config";



export class CreateCategoryDto {

    private constructor(
        public readonly name: string,
        public readonly available: string,
    ){}

    static create( props: {[key:string]:any}): [string?, CreateCategoryDto?]{
        const{ name, available = false } = props;
        let asBooleanAvailable = available;

        if(!name) return ['Missing name'];
        if(typeof available !== 'boolean'){
            asBooleanAvailable = (available === 'true') //si es diferente de un boolean lo convierte a boolean.
        }

        return [undefined, new CreateCategoryDto(name, asBooleanAvailable)];
    }
}