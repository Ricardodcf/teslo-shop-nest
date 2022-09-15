import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  
  constructor(
    private readonly productService: ProductsService,

    @InjectRepository( User ) 
    private readonly userRepository: Repository<User>
  ) {}


  async runSeed() {
    await this.deleteTables();
    const user = await this.insertUsers();
    await this.insertNewProducts(user);
    return 'SEED EXCECUTED'

  }

  private async deleteTables() {
    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()
  }

  private async insertUsers() {
    const seedUser = initialData.users;
    const users: User[] = [];

    seedUser.forEach( user => {
      users.push( this.userRepository.create(user))
    });

    // ASI funciona
    // await this.userRepository.save(users) tambien funciona ju8nto con la linea de abajo
    // return users[0];

    // SINO ASI TAMBIEN FUNCIONA
    const dbUsers = await this.userRepository.save(seedUser);
    return dbUsers[0];

  }
  private async insertNewProducts(user: User) {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromises);


    return true;
  }
}
