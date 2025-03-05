import { Router } from "express";
import { ensureAuthentication } from "../middlewares/userValidation.js";

const router = Router();

router.get("/", ensureAuthentication, (req, res) => {
  console.log(req.user);
  res.json({ message: "Test route" });
});

export default router;
