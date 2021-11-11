import { Request, Response } from 'express';
import { logger } from '../plugins/logger';
import { regionService } from '../services';
import { loggerTopic } from '../utils/loggerTopics';

type TRegionReqBody = {
  regionName?: string;
  newRegionName?: string;
};

type TRegionReqParam = {
  regionId: string;
};

const addRegion = async (req: Request, res: Response) => {
  const { regionName } = req.body as TRegionReqBody;

  if (typeof regionName === 'undefined' || regionName.trim() === '') {
    res.status(400).json({
      status: 'error',
      reason: 'Region name is required and cannot be empty string'
    });
    return;
  }

  try {
    const region = await regionService.addRegion(regionName.trim());
    res
      .status(201)
      .json({ status: 'success', message: 'Region created', result: region });
  } catch (error) {
    logger.error(`[${loggerTopic.REGION}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const getRegions = async (req: Request, res: Response) => {
  try {
    const regions = await regionService.getRegions();
    res.json({ status: 'success', result: regions });
  } catch (error) {
    logger.error(`[${loggerTopic.REGION}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const getRegion = async (req: Request, res: Response) => {
  const { regionId } = req.params as TRegionReqParam;

  if (!Number.isInteger(+regionId)) {
    res.status(400).json({ status: 'error', reason: 'Region id format error' });
    return;
  }

  try {
    const region = await regionService.getRegion(regionId);
    res.json({ status: 'success', result: region });
  } catch (error) {
    logger.error(`[${loggerTopic.REGION}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const editRegion = async (req: Request, res: Response) => {
  const { newRegionName } = req.body as TRegionReqBody;
  const { regionId } = req.params as TRegionReqParam;

  if (!Number.isInteger(+regionId)) {
    res.status(400).json({ status: 'error', reason: 'Region id format error' });
    return;
  }
  if (typeof newRegionName === 'undefined' || newRegionName.trim() === '') {
    res.status(400).json({
      status: 'error',
      reason: 'New region name is required and cannot be empty string'
    });
    return;
  }

  try {
    await regionService.editRegion(regionId, newRegionName.trim());
    res.json({ status: 'success', result: 'Category edited' });
  } catch (error) {
    logger.error(`[${loggerTopic.REGION}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const deleteRegion = async (req: Request, res: Response) => {
  const { regionId } = req.params as TRegionReqParam;

  if (!Number.isInteger(+regionId)) {
    res.status(400).json({ status: 'error', reason: 'Region id format error' });
    return;
  }

  try {
    await regionService.deleteRegion(regionId);
    res.json({ status: 'success', result: 'Category deleted' });
  } catch (error) {
    logger.error(`[${loggerTopic.REGION}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

export default {
  addRegion,
  getRegion,
  getRegions,
  editRegion,
  deleteRegion
};
