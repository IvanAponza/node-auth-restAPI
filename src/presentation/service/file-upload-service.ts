import path from "path";
import fs from "fs";
import { UploadedFile } from "express-fileupload"; //adapter <--- pasar a adapter
import { UUid } from "../../config";
import { CustomError } from "../../domain";


export class FileUploadService {

    constructor(
        private readonly uuid = UUid.v4,
    ) {}

    //Metodo 
    private checkFolder( folderPath: string){
        //Verificar si existe el directorio
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath); //Si no existe lo crea
        }
    }

    //TODO: Metodo para para validar que folder exista 

    async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif'],
    ){
        try {
            const fileExtension = file?.mimetype?.split('/').at(1) ?? ''; // si no viene nada string vacio
            //Validar la extension del archivo
            if(!validExtensions.includes(fileExtension)){
                throw CustomError.badRequest(`Invalid extension: ${fileExtension}, valid extensions: ${validExtensions}`);
            }

            //TODO: validar que el folder exista y luego mover el archivo
            const destination = path.resolve( __dirname, `../../../`, folder);
            this.checkFolder(destination);// validar si existe el directorio

            const fileName = `${this.uuid()}.${fileExtension}`;// Nombre del archivo

            file.mv(`${destination}/${fileName}`); //Mover el archivo a directorio

            return {fileName, };
            
        } catch (error) {
            // console.log(error);
            throw error;
        }
    }
    async uploadMultiple(
        files: UploadedFile[],
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif'],
    ){
        const fileName = await Promise.all(
            files.map(file => this.uploadSingle(file, folder, validExtensions))
        );

        return fileName;

    }
}