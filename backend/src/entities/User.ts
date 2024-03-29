import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Cart } from './Cart';
import { Order } from './Order';
import { Restaurant } from './Restaurant';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: false })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({ type: 'varchar', nullable: false })
  username!: string;

  @Column({
    type: 'boolean',
    name: 'is_registered_restaurant',
    nullable: false,
    default: false
  })
  isRegisteredRestaurant!: boolean;

  @Column({
    type: 'boolean',
    name: 'is_admin',
    nullable: false,
    default: false
  })
  isAdmin!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToOne(() => Restaurant, (restaurant) => restaurant.owner)
  restaurant!: Restaurant;

  @OneToMany(() => Cart, (cart) => cart.customer)
  carts!: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];
}
