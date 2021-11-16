import { getRepository } from 'typeorm';
import { ProductRegion } from '../entities/ProductRegion';

const addRegion = async (regionName: string) => {
  const regionRepo = getRepository(ProductRegion);
  const region = regionRepo.create({ regionName });
  return await regionRepo.save(region);
};

const getRegions = async () => {
  const regionRepo = getRepository(ProductRegion);
  const regions = await regionRepo.find();
  return regions;
};

const getRegion = async (regionId: string) => {
  const regionRepo = getRepository(ProductRegion);
  const region = await regionRepo.findOne(regionId);
  return region;
};

const editRegion = async (regionId: string, newRegionName: string) => {
  const regionRepo = getRepository(ProductRegion);
  await regionRepo.update(regionId, {
    regionName: newRegionName
  });
  return;
};

const deleteRegion = async (regionId: string) => {
  const regionRepo = getRepository(ProductRegion);
  await regionRepo.delete(regionId);
  return;
};

export default {
  addRegion,
  getRegion,
  getRegions,
  editRegion,
  deleteRegion
};
