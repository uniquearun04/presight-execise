import express from "express";
import routes from "./routes/users.routes.js";

const app = express();

const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        service: "presight-server"
    });
});

// Users API
app.use("/api/users", routes);

// 404
app.use((req, res) => {
    res.status(404).json({
        error: "NOT_FOUND",
        message: "Requested endpoint does not exist"
    });
});

// Handle unexpected errors
app.use((err, req, res, next) => {
    console.error("Unexpected server error:", err);
    res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred"
    });
});

app.listen(PORT, () => {
    console.log(`Presight server running on http://localhost:${PORT}`)
});
export default app;
