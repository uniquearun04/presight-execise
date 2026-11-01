const API_URL = "/api/users";

export async function fetchUsers({
    search = "",
    nationalities = [],
    hobbies = [],
    sortBy = "first_name",
    sortDirection = "asc",
    limit = 20,
    offset = 0,
    signal,
} = {}) {

    const params = new URLSearchParams({
        search,
        nationalities: nationalities.join(","),
        hobbies: hobbies.join(","),
        sortBy,
        sortDirection,
        limit: String(limit),
        offset: String(offset),
    });

    const response = await fetch(`${API_URL}?${params}`, {
        signal,
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch users. HTTP ${response.status}`
        );
    }
    return response.json();
}