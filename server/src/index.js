import express from "express";
import { seedDatabase } from "./seed.js";
import { findUsers } from "./userRepository.js";

import routes from "../routes/users.routes.js";

const app = express();

const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

seedDatabase();

function parseList(value) {
    if (typeof value !== "string" || !value.trim()) {
        return [];
    }

    return [...new Set(
        value.split(",")
            .map((item) => item.trim())
            .filter(Boolean)
    )];
}

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        service: "presight-server"
    });
});

// Users API
// app.use("/api/users", routes);
app.get("/api/users", (req, res) => {
    try {
        const result = findUsers({
            search: String(req.query.search ?? ""),
            nationalities: parseList(req.query.nationalities),
            hobbies: parseList(req.query.hobbies),
            sortBy: String(req.query.sortBy ?? "first_name"),
            sortDirection: String(
                req.query.sortDirection ?? "asc"
            ),
            limit: req.query.limit ?? 20,
            offset: req.query.offset ?? 0,
        });

        res.json(result);
    } catch (error) {
        console.error("Failed to fetch users:", error);

        res.status(500).json({
            error: "Failed to fetch users",
        });
    }
});

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
