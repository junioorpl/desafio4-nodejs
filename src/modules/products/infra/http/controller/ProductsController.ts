import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const createProduct = container.resolve(CreateProductService);
    const product = createProduct.execute(data);
    return response.json(product);
  }
}
