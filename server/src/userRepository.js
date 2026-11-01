
import { db } from "./db.js";

const SORT_COLUMNS = {
    first_name: "u.first_name",
    last_name: "u.last_name",
    age: "u.age",
    nationality: "u.nationality",
};

function buildWhere({
    search = "",
    nationalities = [],
    hobbies = [],
}) {
    const conditions = [];
    const params = [];

    const normalizedSearch = search.trim().toLowerCase();

    if (normalizedSearch) {
        conditions.push(`
            (
                LOWER(u.first_name) LIKE ? OR
                LOWER(u.last_name) LIKE ? OR
                LOWER(u.first_name || ' ' || u.last_name) LIKE ?
            )
        `);

        const pattern = `%${normalizedSearch}%`;
        params.push(pattern, pattern, pattern);
    }

    if (nationalities.length > 0) {
        const placeholders =
            nationalities.map(() => "?").join(",");

        conditions.push(`
            u.nationality IN (${placeholders})
        `);

        params.push(...nationalities);
    }

    // Every selected hobby must exist for the user.
    for (const hobby of hobbies) {
        conditions.push(`
            EXISTS (
                SELECT 1
                FROM user_hobbies uh
                JOIN hobbies h ON h.id = uh.hobby_id
                WHERE uh.user_id = u.id
                  AND h.name = ?
            )
        `);

        params.push(hobby);
    }

    return {
        where: conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "",
        params,
    };
}

function getFacets(where, params) {
    const nationalities = db.prepare(`
        SELECT
            u.nationality AS name,
            COUNT(*) AS count
        FROM users u
        ${where}
        GROUP BY u.nationality
        ORDER BY count DESC, name ASC
        LIMIT 20
    `).all(...params);

    const hobbies = db.prepare(`
        SELECT
            h.name AS name,
            COUNT(DISTINCT u.id) AS count
        FROM users u
        JOIN user_hobbies uh ON uh.user_id = u.id
        JOIN hobbies h ON h.id = uh.hobby_id
        ${where}
        GROUP BY h.id, h.name
        ORDER BY count DESC, name ASC
        LIMIT 20
    `).all(...params);

    return { nationalities, hobbies };
}

export function findUsers({
    search = "",
    nationalities = [],
    hobbies = [],
    sortBy = "first_name",
    sortDirection = "asc",
    limit = 20,
    offset = 0,
} = {}) {
    const { where, params } = buildWhere({
        search,
        nationalities,
        hobbies,
    });

    const sortColumn =
        SORT_COLUMNS[sortBy] ?? SORT_COLUMNS.first_name;

    const direction =
        sortDirection.toLowerCase() === "desc"
            ? "DESC"
            : "ASC";

    const pageLimit = Math.min(
        100,
        Math.max(1, Number(limit) || 20)
    );

    const pageOffset = Math.max(
        0,
        Number(offset) || 0
    );

    // Total matching users, before pagination.
    const { total } = db.prepare(`
        SELECT COUNT(*) AS total
        FROM users u
        ${where}
    `).get(...params);

    // Only retrieve the requested page.
    const rows = db.prepare(`
        SELECT
            u.id,
            u.avatar,
            u.first_name AS firstName,
            u.last_name AS lastName,
            u.age,
            u.nationality
        FROM users u
        ${where}
        ORDER BY ${sortColumn} ${direction}, u.id ASC
        LIMIT ? OFFSET ?
    `).all(...params, pageLimit, pageOffset);

    // Load hobbies for the users in this page.
    // This avoids querying hobbies once per user.
    const hobbyMap = new Map(
        rows.map((user) => [user.id, []])
    );

    if (rows.length > 0) {
        const placeholders = rows.map(() => "?").join(",");

        const hobbyRows = db.prepare(`
            SELECT
                uh.user_id AS userId,
                h.name
            FROM user_hobbies uh
            JOIN hobbies h ON h.id = uh.hobby_id
            WHERE uh.user_id IN (${placeholders})
            ORDER BY h.name ASC
        `).all(...rows.map((user) => user.id));

        for (const hobby of hobbyRows) {
            hobbyMap.get(hobby.userId).push(hobby.name);
        }
    }

    const users = rows.map((user) => ({
        ...user,
        hobbies: hobbyMap.get(user.id),
    }));

    const hasMore = pageOffset + users.length < total;

    return {
        users,

        pagination: {
            total,
            limit: pageLimit,
            offset: pageOffset,
            returned: users.length,
            hasMore,
            nextOffset: hasMore
                ? pageOffset + users.length
                : null,
        },

        facets: getFacets(where, params),
    };
}
