import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'Restaurant_Category' })
export class RestaurantCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'category_name', type: 'varchar', nullable: false })
  categoryName!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
