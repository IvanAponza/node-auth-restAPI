import { NextFunction, Request, Response } from "express";
import { JwtAuth } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";


export class AuthMiddleware {

    static async validateJWT(req: Request, res: Response, next: NextFunction){

        const authorization = req.header('Authorization');
        if( !authorization ) return res.status(401).json({error: 'Not token provided'});
        if(!authorization.startsWith('Bearer')) return res.status(401).json({error: 'Invalid Bearer token'}); // si no empieza con la palabra Bearer

        //Tomamos el token si noviene nada retorn string vacio
        const token = authorization.split(' ').at(1) || '';

        try {
            //validamos token
            const payload = await JwtAuth.validateToken<{ id: string }>(token);
            if( !payload ) return res.status(401).json({error: 'Invalid token'});

            //Buscamos user por id
            const user = await UserModel.findById(payload.id);
            
            // Todo Validar si el user esta activo - para invalidar token
            if( !user ) return res.status(401).json({ error: 'Invalid token - user'});

            req.body.user = UserEntity.fromObject(user);

            // todo ok
            next();

        } catch (error) {
            console.log(error) //Winston
            res.status(500).json({error: 'Internal Server Error'});
        }



    }
}