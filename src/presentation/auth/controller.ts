import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../service/auth-service";



export class AuthController {

    //ID
    constructor(
        public readonly authService: AuthService,
    ){}

    //Manejo Error personalizado
    private handleError = (error: unknown, res: Response) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
        }

        console.log(`${error}`);
        return res.status(500).json({error: 'Internal server error'});
    }

    register = (req: Request, res: Response) => {

        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if(error) return res.status(400).json({error});

        this.authService.register(registerUserDto!)
            .then((user) => res.json(user))
            .catch(error => this.handleError(error, res));
    }

    login = (req: Request, res: Response) => {

        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if(error) return res.status(400).json({error});

        this.authService.login(loginUserDto!)
            .then((user) => res.json(user))
            .catch(error => this.handleError(error, res));
    }

    validateEmail = (req: Request, res: Response) => {
        const {token} = req.params;

        this.authService.validateEmail(token)
            .then(() => res.json('Email validated'))
            .catch(error => this.handleError(error, res));

    }
}