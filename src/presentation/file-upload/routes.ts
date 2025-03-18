import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../service/file-upload-service';
import { FileUploadMiddleware } from '../middleware/file-upload.middleware';
import { TypeMiddleware } from '../middleware/type-middleware';

export class FileUploadRoutes {

  static get routes(): Router {

    const router = Router();

    const controller = new FileUploadController(
      new FileUploadService()
    );
    
    // Middleware <<-- Aplica a las rutas 👇
    router.use(FileUploadMiddleware.containFiles);
    router.use(TypeMiddleware.validTypes(['users', 'products', 'categories']));

    // Definir las rutas --> hacemos flexible para que pueda subir imagen a diferentes rutas.
    // api/upload/single/<user | product | category> 
    // api/upload/multiple/<user | product | category>
    router.post('/single/:type', controller.uploadFiles);
    router.post('/multiple/:type', controller.uploadMultipleFiles);

    return router;
  }
}