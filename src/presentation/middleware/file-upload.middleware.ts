import { NextFunction, Request, Response } from "express";


export class FileUploadMiddleware {

    static containFiles = (req: Request, res: Response, next: NextFunction) => {

        //si no existe el archivo o el objeto esta vacio lazar error
        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({error: 'No files were selected.'});
        }

        //Si el archivo no es un array 
        if(!Array.isArray(req.files.file)){
            req.body.files = [req.files.file]; //lo convierte en un array 
        } else {
            req.body.files = req.files.file; //si es un array lo deja como esta 
        }
        next();
    }
}