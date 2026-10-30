
import UserCard from "./components/UserCard";
import users from "./data/users";
import styles from "./App.module.css";

export default function App() {
    return (
        <main className={styles.container}>
            <h1 className={styles.title}>
                Presight User Directory
            </h1>

            <p className={styles.subtitle}>
                Total Users: {users.length}
            </p>

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
