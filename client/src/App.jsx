
import UserCard from "./components/UserCard/UserCard";
import users from "./data/users";
import styles from "./App.module.css";
import { useMemo, useState } from "react";
import FilterSidebar from "./components/FilterSidebar/FilterSidebar";


export default function App() {
    
    const [selectedNationalities, setSelectedNationalities] = useState([]);
    const [selectedHobbies, setSelectedHobbies] = useState([]);

    function toggleNationality(value) {
        setSelectedNationalities((previous) => previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value]);
    }

    function toggleHobby(value) {
        setSelectedHobbies((previous) => previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value]);
    }

    function clearFilters() {
        setSelectedNationalities([]);
        setSelectedHobbies([]);
    }

    const filteredUsers = users.filter((user) => {
        const matchesNationality = selectedNationalities.length === 0 || selectedNationalities.includes(user.nationality);
        const matchesHobby = selectedHobbies.length === 0 || selectedHobbies.some((hobby) => user.hobbies.includes(hobby));
        return matchesNationality && matchesHobby;
    });

    function calculateFacets(filteredUsers, field) {
        const countsMap = new Map();
        filteredUsers.forEach((user) => {
            const values = Array.isArray(user[field]) ? user[field] : [user[field]];
            new Set(values).forEach((value) => {
                if (!value) return;
                countsMap.set(value, (countsMap.get(value) || 0) + 1);
            });
        });
        return [...countsMap.entries()]
            .map(([name, count]) => ({name, count}))
            .sort((a, b) => 
                b.count - a.count || a.name.localeCompare(b.name)
            )
            .slice(0, 20);
    }

    const nationalities = calculateFacets(users, "nationality");
    const hobbies = calculateFacets(users, "hobbies");


    return (
        <main className={styles.container}>
            <h1 className={styles.title}>
                Presight User Directory
            </h1>

            <p className={styles.subtitle}>
                Total Users: {users.length}
            </p>

            <FilterSidebar
                nationalities={nationalities}
                hobbies={hobbies}
                selectedNationalities={selectedNationalities}
                selectedHobbies={selectedHobbies}
                onNationalityChange={toggleNationality}
                onHobbyChange={toggleHobby}
                onClearFilters={clearFilters}
            />
            <p>Matching users: {filteredUsers.length}</p>

            <div className={styles.scrollContainer}>
                <div className={styles.userGrid}>
                    {users.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
