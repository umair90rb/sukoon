import express from "express";
import UserController from "../controllers/UserController";
import { PERMISSIONS } from "../constants/constants";

import can from "../middleware/canAccess";
import Auth from "../middleware/auth";
import { createRoleSchema, updateRoleSchema } from "../schemas/roleSchema";
import { idSchema } from "../schemas/commonSchema";
import schemaValidator from "../middleware/schemaValidator";
import { createValidator } from "express-joi-validation";
import RoleController from "../controllers/RoleController";

const router = express.Router();
const validator = createValidator();

router.get(
  "/all",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_ROLE),
  RoleController.roles
);

router.get(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_ROLE),
  validator.params(idSchema),
  RoleController.role
);

router.post(
  "/",
  Auth,
  can(PERMISSIONS.PERMISSION_CREATE_ROLE),
  schemaValidator(createRoleSchema),
  RoleController.create
);

router.put(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_ROLE),
  validator.params(idSchema),
  schemaValidator(updateRoleSchema),
  RoleController.update
);

router.delete(
  "/:id",
  Auth,
  can(PERMISSIONS.PERMISSION_UPDATE_ROLE),
  validator.params(idSchema),
  RoleController.destroy
);

export default router;
