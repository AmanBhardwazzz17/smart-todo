import { Router } from "express";
import { createTodo, getTodos, toggleTodo, deleteTodo, updateTodo} from "../controllers/todo.controller.js";
import { verifyjwt} from "../middlewares/auth.middleware.js";
import { /* ...purane... */ breakdownTodo } from "../controllers/todo.controller.js";



const router = Router();

// Is line ke neeche jitne bhi routes hain, sab par verifyJWT pehle chalega.
// Har route mein alag-alag likhne ki zaroorat nahi.
router.use(verifyjwt);

router.route("/").post(createTodo).get(getTodos);
router.route("/:id").patch(toggleTodo).delete(deleteTodo);
router.route("/:id").patch(updateTodo);
router.route("/:id/breakdown").post(breakdownTodo);

export default router;