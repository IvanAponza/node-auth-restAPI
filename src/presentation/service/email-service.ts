import nodemailer, {Transporter} from 'nodemailer';


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
        private readonly postToProvider: boolean, //No enviar email
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

            if(!this.postToProvider) return true; // no quiero enviar correo

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