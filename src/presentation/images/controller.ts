import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';

export class ImageController {

    constructor(){}

    getImage = (req: Request, res: Response) => {
        const {type = '', img = ''} = req.params;
        const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);
        if(!fs.existsSync(imagePath)){
            return res.status(400).send({message: 'Image not found'});
        }
        res.sendFile(imagePath);
    }
}