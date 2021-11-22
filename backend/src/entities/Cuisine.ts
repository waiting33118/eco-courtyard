import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
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

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.cuisines)
  @JoinColumn()
  restaurant!: Restaurant;
}
