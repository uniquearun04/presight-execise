
const firstNames = [
    "Rahul", "Emma", "John", "Sophia", "Mohammed",
    "Olivia", "Aarav", "Isabella", "Liam", "Priya",
    "Noah", "Aisha", "James", "Mia", "Arjun",
    "Charlotte", "William", "Fatima", "Lucas", "Ananya"
];

const lastNames = [
    "Sharma", "Wilson", "Smith", "Brown", "Khan",
    "Johnson", "Patel", "Taylor", "Ali", "Singh",
    "Anderson", "Thomas", "Gupta", "Martin", "Ahmed"
];

const nationalities = [
    "Indian", "British", "American", "Emirati",
    "Canadian", "Australian", "German", "French",
    "Pakistani", "Japanese"
];

const hobbiesList = [
    "Photography", "Traveling", "Cricket",
    "Reading", "Swimming", "Gaming",
    "Cycling", "Music", "Cooking",
    "Football", "Painting", "Hiking",
    "Dancing", "Running", "Chess"
];

const users = Array.from({ length: 1000 }, (_, index) => {
    const id = index + 1;

    const hobbyCount = index % 11; // 0 to 10 hobbies

    const hobbies = Array.from(
        { length: hobbyCount },
        (_, hobbyIndex) =>
            hobbiesList[(index + hobbyIndex) % hobbiesList.length]
    );

    return {
        id,
        firstName: firstNames[index % firstNames.length],
        lastName: lastNames[index % lastNames.length],
        age: 20 + (index % 40),
        nationality: nationalities[index % nationalities.length],
        avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
        hobbies
    };
});

// console.log("users:", users)
export default users;
