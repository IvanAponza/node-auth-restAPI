import nodemailer, {Transporter} from 'nodemailer';
import { JwtAuth } from '../../config';
import { CustomError } from '../../domain';
import { UserModel } from '../../data';


export interface SendMailOptions {
    to: string | string[];
    subject: string;
    html: string;
    attachements?: Attachements[];
}

//Attachements
export interface Attachements {
    filename: string;
    path: string;
}


export class EmailService {

    private transporter: Transporter;

    constructor(
        mailerService: string,
        mailerEmail: string,
        mailerSecretKey: string,
    ){
        //inicializamos el transporter
        this.transporter = nodemailer.createTransport({
            service: mailerService,
            auth: {
                user: mailerEmail,
                pass: mailerSecretKey,
            }
        });

    }

    //Metodo para enviar E-mail
    async sendEmail( options: SendMailOptions):Promise<boolean>{

        const { to, subject, html, attachements=[] } = options;

        try {

            const sendInformation = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: html,
                attachments: attachements
            });

            // console.log(sendInformation);
            // sendInformation se puede retornar todos los destinatarios que no les llego el email

            return true;
        } catch (error) {
            return false;
        }
    }
}