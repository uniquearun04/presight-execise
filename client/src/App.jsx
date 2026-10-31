
import UserCard from "./components/UserCard/UserCard";
import users from "./data/users";
import styles from "./App.module.css";
import { useEffect, useMemo, useState } from "react";
import FilterSidebar from "./components/FilterSidebar/FilterSidebar";
import SearchBar from "./components/SearchBar/SearchBar";
import SortControls from "./components/SortControls/SortControls";
import UserListState from "./components/UserListState/UserListState";

import { fetchUsers } from "./service/userService";
import VirtualUserList from "./components/VirtualUserList/VirtualUserList";

export default function App() {
    
    const [selectedNationalities, setSelectedNationalities] = useState([]);
    const [selectedHobbies, setSelectedHobbies] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");

    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

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

    function clearAllFilters() {
        setSearchText("");
        setSelectedNationalities([]);
        setSelectedHobbies([]);
}

    const filteredUsers = useMemo(() => {
        const search = searchText.trim().toLowerCase();
        return allUsers.filter((user) => {
            const firstName = user.firstName.toLowerCase();
            const lastName = user.lastName.toLowerCase();
            const fullName = `${firstName} ${lastName}`;

            const matchedSearch = search === "" || firstName.includes(search) || lastName.includes(search) || fullName.includes(search)
            const matchesNationality = selectedNationalities.length === 0 || selectedNationalities.includes(user.nationality);
            const matchesHobby = selectedHobbies.length === 0 || selectedHobbies.some((hobby) => user.hobbies.includes(hobby));
            
            return matchedSearch && matchesNationality && matchesHobby;
        });
    }, [allUsers, searchText, selectedNationalities, selectedHobbies]);

    const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
            let comparision = 0;
            switch(sortField) {
                case "age":
                    comparision = a.age - b.age;
                    break;
                case "nationality":
                    comparision = a.nationality.localeCompare(b.nationality);
                    break;
                case name:
                default: 
                    const nameA = `${a.firstName} ${a.lastName}`;
                    const nameB = `${b.firstName} ${b.lastName}`
                    comparision = nameA.localeCompare(nameB);
                    break;
            }
            const direction = sortDirection === "asc" ? 1 : -1;
            return comparision * direction || a.id - b.id;
        });
    }, [filteredUsers, sortField, sortDirection]);

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

    const nationalities = useMemo(() => calculateFacets(filteredUsers, "nationality"), [filteredUsers]);
    const hobbies = useMemo(() => calculateFacets(filteredUsers, "hobbies"), [filteredUsers]);

    useEffect(() => {
        let cancelled = false;

        async function loadUsers() {
            setLoading(true);
            setError(null);
            try {
                const result = await fetchUsers();

                if (!cancelled) {
                    setAllUsers(result);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Unknown error");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        loadUsers();
        return () => {
            cancelled = true;
        };
    }, [retryCount]);

    function retryLoading() {
        setRetryCount((previous) => previous + 1);
    }

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>
                Presight User Directory
            </h1>

            <SearchBar
                value={searchText}
                onChange={setSearchText}
            />

            <div className={styles.layout}>
                <FilterSidebar
                    nationalities={nationalities}
                    hobbies={hobbies}
                    selectedNationalities={selectedNationalities}
                    selectedHobbies={selectedHobbies}
                    onNationalityChange={toggleNationality}
                    onHobbyChange={toggleHobby}
                    onClearFilters={clearAllFilters}
                />
                <section className={styles.results}>
                    <h2 className={styles.resultsTitle}>
                        Matching Users ({filteredUsers.length})
                    </h2>

                    <SortControls 
                        sortField={sortField}
                        onSortFieldChange={setSortField}
                        sortDirection={sortDirection}
                        onSortDirectionChange={setSortDirection}
                    />
                    {loading ? (
                        <UserListState type="loading"/>
                    ) : error ? (
                        <UserListState type="error" message={error} onRetry={retryLoading}/>
                    ) : sortedUsers.length === 0 ? (
                        <UserListState type="empty" onClear={clearAllFilters} />
                    ) : (
                        // <div className={styles.scrollContainer}>
                        //     <div className={styles.userGrid}>
                        //         {sortedUsers.map((user) => (
                        //             <UserCard
                        //                 key={user.id}
                        //                 user={user}
                        //             />
                        //         ))}
                        //     </div>
                        // </div>
                        <VirtualUserList users={sortedUsers} />
                    )}
                </section>
            </div>
        </main>
    );
}
