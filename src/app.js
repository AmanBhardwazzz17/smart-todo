import  express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import todoRouter from "./routes/todo.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/todos", todoRouter);
app.use(express.static("public"));

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    return res.status (statusCode).json ({
        success: false,
        statusCode,
        message: err.message || "Internal Server Error",
    });
});
export{ app };


