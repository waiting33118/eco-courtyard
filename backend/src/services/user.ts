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
  return await userRepo.findOne(userId);
};

export default {
  addUser,
  getUserByEmail,
  getUserById
};
