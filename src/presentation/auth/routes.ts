import { envs } from '../../config';
import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService, EmailService } from '../service';




export class AuthRoutes {

  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL,
    )
    const authService = new AuthService(emailService) //instac
    const controller = new AuthController(authService);

    // Definir las rutas
    router.post('/login', controller.login);
    router.post('/register', controller.register);
    router.get('/validate-email/:token', controller.validateEmail);


    return router;
  }


}

