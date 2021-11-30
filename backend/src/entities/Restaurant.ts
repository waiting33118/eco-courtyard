import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Cuisine } from './Cuisine';
import { RestaurantCategory } from './RestaurantCategory';
import { RestaurantRegion } from './RestaurantRegion';
import { User } from './User';

@Entity({ name: 'Restaurant' })
export class Restaurant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ type: 'varchar', nullable: false })
  address!: string;

  @Column({ type: 'varchar', name: 'start_time', nullable: false })
  startTime!: string;

  @Column({ type: 'varchar', name: 'close_time', nullable: false })
  closeTime!: string;

  @Column({ type: 'text', name: 'image_url', nullable: true })
  imageUrl!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => RestaurantCategory)
  @JoinColumn()
  category!: RestaurantCategory;

  @ManyToOne(() => RestaurantRegion)
  @JoinColumn()
  region!: RestaurantRegion;

  @OneToMany(() => Cuisine, (cuisine) => cuisine.restaurant)
  cuisines!: Cuisine[];

  @OneToOne(() => User, (user) => user.restaurant)
  @JoinColumn()
  owner!: User;
}
