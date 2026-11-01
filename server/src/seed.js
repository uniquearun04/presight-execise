
import { db } from "./db.js";

const FIRST_NAMES = [
    "Aarav", "Emma", "Oliver", "Sophia", "Noah",
    "Mia", "Liam", "Aisha", "Lucas", "Amelia",
    "Ethan", "Isabella", "Daniel", "Zara",
    "James", "Hana", "Leo", "Sara", "Adam", "Emily",
];

const LAST_NAMES = [
    "Sharma", "Smith", "Wilson", "Khan", "Patel",
    "Brown", "Lee", "Ahmed", "Martin", "Garcia",
    "Taylor", "Ali", "Jones", "Thomas", "Kim",
];

const NATIONALITIES = [
    "American", "Australian", "British", "Canadian",
    "Emirati", "French", "German", "Indian",
    "Japanese", "Pakistani",
];

const HOBBIES = [
    "Reading", "Cricket", "Football", "Swimming",
    "Cooking", "Traveling", "Photography",
    "Gaming", "Cycling", "Painting",
    "Music", "Hiking", "Dancing", "Running",
    "Gardening", "Chess", "Yoga", "Writing",
    "Tennis", "Basketball",
];

export function seedDatabase() {
    const existingUsers = db
        .prepare("SELECT COUNT(*) AS count FROM users")
        .get().count;

    if (existingUsers > 0) {
        console.log(`Database already has ${existingUsers} users`);
        return;
    }

    const insertUser = db.prepare(`
        INSERT INTO users (
            id, avatar, first_name, last_name,
            age, nationality
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertHobby = db.prepare(`
        INSERT OR IGNORE INTO hobbies (name)
        VALUES (?)
    `);

    const findHobby = db.prepare(`
        SELECT id FROM hobbies WHERE name = ?
    `);

    const insertUserHobby = db.prepare(`
        INSERT INTO user_hobbies (user_id, hobby_id)
        VALUES (?, ?)
    `);

    const seed = db.transaction(() => {
        for (const hobby of HOBBIES) {
            insertHobby.run(hobby);
        }

        const hobbyIds = HOBBIES.map(
            (hobby) => findHobby.get(hobby).id
        );

        for (let i = 0; i < 1000; i++) {
            const id = i + 1;

            const firstName =
                FIRST_NAMES[(i * 7) % FIRST_NAMES.length];

            const lastName =
                LAST_NAMES[(i * 11) % LAST_NAMES.length];

            const age = 18 + ((i * 13) % 48);

            const nationality =
                NATIONALITIES[i % NATIONALITIES.length];

            const avatar =
                `https://i.pravatar.cc/150?img=${(i % 70) + 1}`;

            insertUser.run(
                id,
                avatar,
                firstName,
                lastName,
                age,
                nationality
            );

            const hobbyCount = (i % 5) + 1;

            for (let j = 0; j < hobbyCount; j++) {
                const hobbyIndex =
                    (i * 7 + j * 3) % hobbyIds.length;

                insertUserHobby.run(
                    id,
                    hobbyIds[hobbyIndex]
                );
            }
        }
    });

    seed();

    console.log("Seeded 1,000 users into SQLite");
}
