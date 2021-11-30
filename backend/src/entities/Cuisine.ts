import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Restaurant } from './Restaurant';

@Entity({ name: 'Cuisine' })
export class Cuisine {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ type: 'integer', nullable: false })
  price!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.cuisines)
  @JoinColumn()
  restaurant!: Restaurant;
}
