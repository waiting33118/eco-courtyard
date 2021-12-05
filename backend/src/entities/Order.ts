import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { OrderCuisine } from './OrderCuisine';
import { Restaurant } from './Restaurant';
import { User } from './User';

@Entity({ name: 'Order' })
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer', name: 'total_amount', nullable: false })
  totalAmount!: number;

  @Column({
    type: 'boolean',
    name: 'is_served',
    nullable: false,
    default: false
  })
  isServed!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Restaurant)
  @JoinColumn()
  restaurant!: Restaurant;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user!: User;

  @OneToMany(() => OrderCuisine, (orderCuisine) => orderCuisine.order, {
    cascade: true
  })
  orderCuisines!: OrderCuisine[];
}
