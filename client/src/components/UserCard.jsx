
import styles from "./UserCard.module.css";

export default function UserCard({ user }) {
    const {
        avatar,
        firstName,
        lastName,
        age,
        nationality,
        hobbies = [],
    } = user;

    const visibleHobbies = hobbies.slice(0, 2);
    const remainingCount = Math.max(hobbies.length - 2, 0);

    return (
        <div className={styles.card}>
            <div className={styles.content}>

                {/* Avatar */}
                <img
                    src={avatar}
                    alt={`${firstName} ${lastName}`}
                    className={styles.avatar}
                />

                {/* User Details */}
                <div className={styles.userDetails}>

                    <h2 className={styles.name}>
                        {firstName} {lastName}
                    </h2>

                    <div className={styles.userInfo}>
                        <span className={styles.nationality}>
                            {nationality}
                        </span>

                        <span className={styles.age}>
                            {age} years
                        </span>
                    </div>

                    {/* Hobbies */}
                    <div className={styles.hobbies}>
                        {visibleHobbies.map((hobby, index) => (
                            <span
                                key={`${hobby}-${index}`}
                                className={styles.hobby}
                            >
                                {hobby}
                            </span>
                        ))}

                        {remainingCount > 0 && (
                            <span className={styles.remainingCount}>
                                +{remainingCount}
                            </span>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
