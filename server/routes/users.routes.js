
import express from "express";
import getUsers from "../services/user.service.js";

const router = express.Router();

const ALLOWED_SORT_FIELDS = new Set([
    "first_name",
    "last_name",
    "age",
    "nationality"
]);

const ALLOWED_DIRECTIONS = new Set(["asc", "desc"]);

function readString(value, name, defaultValue = "") {
    if (value === undefined) {
        return defaultValue;
    }
    if (typeof value !== "string") {
        throw new Error(`${name} must be a string`)
    }
    return value.trim();
}

function readList(value, name) {
    const text = readString(value, name);
    if (!text) {
        return [];
    }
    return [...new Set(text.split(",").map((item) => item.trim()).filter(Boolean))];
}

function readInteger(value, name, defaultValue, min, max) {
    if (value === undefined) {
        return defaultValue;
    }
    const text = readString(value, name);
    if (!/^\d+$/.test(text)) {
        throw new Error(`${name} must be an integer`);
    }
    const number = Number(text);

    if (!Number.isSafeInteger(number) || number < min || number > max) {
        throw new Error(`${name} must be between ${min} and ${max}`);
    }
    return number;
}

// GET /api/users
router.get("/", (req, res) => {
    try{
        const searchText = readString(req.query.search, "search", "");
        const nationalities = readList(req.query.nationalities, "nationalities");
        const hobbies = readList(req.query.hobbies, "hobbies");
        const sortBy = readString(req.query.sortBy, "sortBy", "first_name");
        const sortDirection = readString(req.query.sortDirection, "sortDirection", "asc").toLowerCase();
        const limit = readInteger(req.query.limit, "limit", 20, 1, 100);
        const offset = readInteger(req.query.offset, "offset", 0, 0, Number.MAX_SAFE_INTEGER);

        if (!ALLOWED_SORT_FIELDS.has(sortBy)) {
            return res.status(400).json({
                error: "INVALID_SORT_FIELD",
                message: `Unsupported sort field ${sortBy}`
            });
        }

        if (!ALLOWED_DIRECTIONS.has(sortDirection)) {
            return res.status(400).json({
                error: "INVALID_SORT_DIRECTION",
                message: "Direction must be asc or desc"
            });
        }
        const result = getUsers({
            searchText,
            nationalities,
            hobbies,
            sortBy,
            sortDirection,
            limit,
            offset
        });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            error: "INVALID_QUERY",
            message: error.message
        });
    }
});

export default router;