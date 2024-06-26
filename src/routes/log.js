import express from "express";

import LogController from "../controllers/LogController";

const router = express.Router();

router.get("/", LogController.logs);

router.get("/:file", LogController.log);

export default router;
