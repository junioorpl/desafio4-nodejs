import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';

import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
  quantity: number;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const foundProducts = [];

    let p;
    // eslint-disable-next-line
    for await (p of products) {
      const product = await this.ormRepository.findOne({ where: { id: p.id } });

      if (product !== undefined && product.quantity >= p.quantity) {
        foundProducts.push({
          ...product,
          quantity: p.quantity,
        });
      } else throw new AppError('Not enough products', 400);
    }

    return foundProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const updatedQuantities = [];
    // eslint-disable-next-line
    for await (const p of products) {
      const item = await this.ormRepository.findOne({ where: { id: p.id } });
      if (item) {
        const updatedItem = await this.ormRepository.save({
          ...item,
          quantity: item.quantity - p.quantity,
        });
        updatedQuantities.push(updatedItem);
      }
    }

    return updatedQuantities;
  }
}

export default ProductsRepository;
