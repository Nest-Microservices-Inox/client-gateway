import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query, ParseUUIDPipe } from '@nestjs/common';

import { SERVICES } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateOrderDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(SERVICES.ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto)
        .pipe(
          catchError( err => {
            throw new RpcException(err);
          } )
        );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersClient.send('findAllOrders', paginationDto)
        .pipe(
          catchError( err => {
            throw new RpcException(err);
          } )
        );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe ) id: string) {
    return this.ordersClient.send('findOneOrder', {id})
    .pipe(
      catchError( err => {
        throw new RpcException(err);
      } )
    );
  }

}
