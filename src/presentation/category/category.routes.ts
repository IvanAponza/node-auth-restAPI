import { Router } from 'express';
import { CategoryController } from './category.controller';
import { AuthMiddleware } from '../middleware/auth-middleware';
import { CategoryService } from '../service/category.service';

export class CategoryRoutes {

  static get routes(): Router {

    const router = Router();

    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService)
    
    // Definir las rutas
    router.get('/', controller.getCategories);
    router.post('/', [ AuthMiddleware.validateJWT ], controller.createCategory);

    //TODO:
    // router.get('/:id', controller.getCategoryById );
    // router.put('/:id', controller.updateCategory );
    // router.delete('/:id', controller.deleteCategory );

    return router;
  }
}