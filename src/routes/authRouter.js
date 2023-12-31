import express from "express";
import AuthController from "../controllers/AuthController";
import schemaValidator from "../middleware/schemaValidator";
import { loginSchema, signUpSchema } from "../schemas/authSchema";

const router = express.Router();

router.post("/login", schemaValidator(loginSchema), AuthController.login);

export default router;
