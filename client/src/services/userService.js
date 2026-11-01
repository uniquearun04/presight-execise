
import users from "../data/users";

export async function fetchUsers() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Uncomment to simulate an API failure:
    // throw new Error("Failed to fetch users from server");

    return users;
}
