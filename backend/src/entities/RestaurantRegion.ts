import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'Restaurant_Region' })
export class RestaurantRegion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'region_name', type: 'varchar', nullable: false })
  regionName!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
