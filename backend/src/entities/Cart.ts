import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Cuisine } from './Cuisine';
import { User } from './User';

@Entity({ name: 'Cart' })
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer', nullable: false })
  quantity!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn()
  customer!: User;

  @ManyToOne(() => Cuisine)
  @JoinColumn()
  cuisine!: Cuisine;
}
