import { getRepository } from 'typeorm';
import { User } from '../entities/User';

const addUser = async (email: string, password: string, username: string) => {
  const userRepo = getRepository(User);
  const user = userRepo.create({ email, password, username });
  return await userRepo.save(user);
};

const getUserByEmail = async (email: string) => {
  const userRepo = getRepository(User);
  return await userRepo.findOne({ where: { email } });
};

const getUserById = async (userId: number) => {
  const userRepo = getRepository(User);
  return await userRepo.findOne(userId, { relations: ['restaurant'] });
};

const editUser = async (userId: number, partial: Partial<User>) => {
  const userRepo = getRepository(User);
  return await userRepo.update(userId, partial);
};

export default {
  addUser,
  getUserByEmail,
  getUserById,
  editUser
};
