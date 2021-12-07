import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Cuisine } from './Cuisine';
import { Order } from './Order';

@Entity({ name: 'Order_Cuisine' })
export class OrderCuisine {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @ManyToOne(() => Order, (order) => order.orderCuisines)
  @JoinColumn()
  order!: Order;

  @ManyToOne(() => Cuisine)
  @JoinColumn()
  cuisine!: Cuisine;
}
