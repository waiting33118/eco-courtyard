import { getRepository } from 'typeorm';
import { RestaurantRegion } from '../entities/RestaurantRegion';

const addRegion = async (regionName: string) => {
  const regionRepo = getRepository(RestaurantRegion);
  const region = regionRepo.create({ regionName });
  return await regionRepo.save(region);
};

const getRegions = async () => {
  const regionRepo = getRepository(RestaurantRegion);
  const regions = await regionRepo.find();
  return regions;
};

const getRegion = async (regionId: number) => {
  const regionRepo = getRepository(RestaurantRegion);
  const region = await regionRepo.findOne(regionId);
  return region;
};

const editRegion = async (regionId: number, newRegionName: string) => {
  const regionRepo = getRepository(RestaurantRegion);
  return await regionRepo.update(regionId, {
    regionName: newRegionName
  });
};

const deleteRegion = async (regionId: string) => {
  const regionRepo = getRepository(RestaurantRegion);
  return await regionRepo.delete(regionId);
};

export default {
  addRegion,
  getRegion,
  getRegions,
  editRegion,
  deleteRegion
};
