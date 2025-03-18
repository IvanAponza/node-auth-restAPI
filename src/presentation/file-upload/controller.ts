import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../service/file-upload-service";
import { UploadedFile } from "express-fileupload";


export class FileUploadController {

    //ID
    constructor(
        private readonly fileUploadService: FileUploadService
    ){}

    //Manejo Error personalizado
    private handleError = (error: unknown, res: Response) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
        }

        console.log(`${error}`);
        return res.status(500).json({error: 'Internal server error'});
    }

    uploadFiles = (req: Request, res: Response) => {

        //Se obtiene el tipo de archivo
        const type = req.params.type;

        // const validTypes = ['users', 'products', 'categories'];
        // if(!validTypes.includes(type)){
        //     return res.status(400).json({error: `Invalid type: ${type}, valid ones ${validTypes}`});
        // }//* LO MOVEMOS A UN MIDDLEWARE <<--- LLEGA VALIDADO POR LAS Rutas
        // const files = req.files;

        // if(!req.files || Object.keys(req.files).length === 0){
        //     return res.status(400).json({error: 'No files were selected.'});
        // } //* LO MOVEMOS A UN MIDDLEWARE <<--- LLEGA VALIDADO POR LAS Rutas

        const file = req.body.files.at(0) as UploadedFile;

        this.fileUploadService.uploadSingle(file, `uploads/${type}`)
            .then(uploaded => res.json(uploaded))
            .catch(error => this.handleError(error, res));
        
    };
    uploadMultipleFiles = (req: Request, res: Response) => {
        //Se obtiene el tipo de archivo
        // const type = req.params.type;
        const type = req.url.split('/').at(2) ?? '';
        const files = req.body.files as UploadedFile[];

        this.fileUploadService.uploadMultiple(files, `uploads/${type}`)
            .then(uploaded => res.json(uploaded))
            .catch(error => this.handleError(error, res));
        
    }    
}