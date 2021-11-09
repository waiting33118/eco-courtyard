import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'Product_Region' })
export class ProductRegion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'region_name', type: 'varchar', nullable: false })
  regionName!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
