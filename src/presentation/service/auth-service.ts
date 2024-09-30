import { Bcrypt, envs, JwtAuth } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email-service";


export class AuthService {

    constructor(
        //inyectamos el Email service
        private readonly emailService: EmailService,
    ){}

    public async register( registerUserDto: RegisterUserDto){

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if(existUser) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel(registerUserDto); //crea user

            //Encriptar password
            user.password = Bcrypt.hash(registerUserDto.password);

            //Guarda user
            user.save();

            //JWT <--- Para mantener la autenticación del usurio
            const token = await JwtAuth.generateToken({id: user.id});
            if(!token) throw CustomError.InternalServer('Error while creating JWT');

            //Email de confirmación User
            this.sendEmailValidationLink(user.email);
            
            //Excluye passwor de la res
            const {password, ...userEntity} = UserEntity.fromObject(user);

            //regresa user
            return {
                user: userEntity,
                token,
            };
        } catch (error) {
            throw CustomError.InternalServer(`${error}`)
        }
    }

    public async login(loginUserDto: LoginUserDto){

        try {
            //Verificar si existe el usuario
            const user = await UserModel.findOne({email: loginUserDto.email});
            if(!user) throw CustomError.badRequest('User not exist');
            
            //isMatch password
            const isMatch = Bcrypt.compare(loginUserDto.password, user.password);
            if(!isMatch) throw CustomError.badRequest('Credentials Incorrects')
            
            //Excluye Password de la respuesta
            const { password, ...userEntity} = UserEntity.fromObject(user);

            //generamos token con las options deseadas
            const token = await JwtAuth.generateToken({id: user.id, email: user.email});
            if(!token)throw CustomError.InternalServer('Error while creating JWT')

            //Regresa user
            return {
                user: userEntity,
                token: token,
            }
            
        } catch (error) {
            throw CustomError.InternalServer(`${error}`)
        }
    }

    //Metodo para 
    private sendEmailValidationLink = async(email: string) => {
        //genera token auth
        const token = await JwtAuth.generateToken({email});
        if(!token) throw CustomError.InternalServer('Error getting token');

        //crea el link para confirmar cuenta
        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${link}">Validate your email: ${email}</a>
        `;

        //Opciones para envio del correo
        const options = {
            to: email,
            subject: 'Confirm your account',
            html: html,
        }

        //Envio correo
        const isSent = await this.emailService.sendEmail(options);
        if(!isSent) throw CustomError.InternalServer('Error sending email');

        //todo ok
        return true;
    }

    public validateEmail = async(token: string) => {
        const payload = await JwtAuth.validateToken(token);
        if(!payload) throw CustomError.unauthorized('Invalid token ');

        const {email} = payload as {email: string};
        if(!email) throw CustomError.InternalServer('Error getting email in token');

        //tomamos el user de DB 
        const user = await UserModel.findOne({email});
        if(!user) throw CustomError.InternalServer('Email not exist');

        //Cambiamos de estado en la DB - Guarda el user
        user.emailValidated = true;
        await user.save();

        //todo ok
        return true;
    }
}