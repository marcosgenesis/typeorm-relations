import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
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
    const product = this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const listProducts = await this.ormRepository.find();
    const allProducts = listProducts.filter(item =>
      products.find(product => product.id === item.id),
    );
    return allProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const listProducts = await this.findAllById(products);

    products.map(productItem => {
      const findElementIndex = listProducts.findIndex(
        product => product.id === productItem.id,
      );
      listProducts[findElementIndex].quantity -= productItem.quantity;
      return productItem;
    });

    await this.ormRepository.save(listProducts);

    return listProducts;
  }
}

export default ProductsRepository;
