import {
    BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { SERVICES } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(SERVICES.PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {

    return this.productsClient.send({ cmd: 'create_product' }, createProductDto)
        .pipe(
            catchError( err =>{
                throw new RpcException(err)
            })
        )
  }

  @Get()
  findAllProduct(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'find_all_products' },paginationDto)
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: string) {

    return this.productsClient.send({ cmd: 'find_one_product' }, {id})
        .pipe(
            catchError( err => { throw new RpcException(err) })
        );

  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send( { cmd: 'delete_product' }, {id} )
            .pipe(
              catchError( err => {
                throw new RpcException(err);
              } )
            )
  }

  @Patch(':id')
  udpateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {

    return this.productsClient.send({ cmd: 'udpate_product' }, {id, ...updateProductDto})
      .pipe(
        catchError( err => {
          throw new RpcException( err );
        })
      )
  }
}
