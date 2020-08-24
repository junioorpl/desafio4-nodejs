import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) { } //eslint-disable-line

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const emailExists = await this.customersRepository.findByEmail(email);
    if (emailExists) throw new AppError('Email already in use');

    const customer = await this.customersRepository.create({ name, email });
    return customer;
  }
}

export default CreateCustomerService;
