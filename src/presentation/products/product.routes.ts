import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth-middleware';
import { ProductController } from './product.controller';
import { ProductService } from '../service';

export class ProductRoutes {

  static get routes(): Router {

    const router = Router();

    const productService = new ProductService();
    const controller = new ProductController(productService)
    
    // Definir las rutas
    router.get('/', controller.getProducts);
    router.post('/', [ AuthMiddleware.validateJWT ], controller.createProduct);

    //TODO:
    // router.get('/:id', controller.getProductById );
    // router.put('/:id', controller.updateProduct );
    // router.delete('/:id', controller.deleteProduct );

    return router;
  }
}