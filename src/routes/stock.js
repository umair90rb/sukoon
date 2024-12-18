import express from 'express';
import StockController from '../controllers/StockController';
import { PERMISSIONS } from '../constants/constants';

import can from '../middleware/canAccess';
import Auth from '../middleware/auth';
import { stockHistorySchema, createStockSchema } from '../schemas/stockSchema';
import schemaValidator from '../middleware/schemaValidator';
import { createValidator } from 'express-joi-validation';

const router = express.Router();
const validator = createValidator();

router.get(
  '/all',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_STOCK),
  StockController.stocks
);

router.post(
  '/history',
  Auth,
  can(PERMISSIONS.PERMISSION_VIEW_STOCK),
  schemaValidator(stockHistorySchema),
  StockController.history
);

router.post(
  '/',
  Auth,
  can(PERMISSIONS.PERMISSION_RECEIVE_STOCK),
  schemaValidator(createStockSchema),
  StockController.create
);

export default router;
