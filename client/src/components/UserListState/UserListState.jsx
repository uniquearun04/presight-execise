import styles from "./UserListState.module.css";

export default function UserListState({
    type,
    message,
    onRetry,
    onClear
}) {

    const stateConfig = {
        loading: {
            icon: "⏳",
            title: "Loading users...",
            description: "Please wait while we fetch users.",
        },
        empty: {
            icon: "🔍",
            title: "No users found",
            description: "Try adjusting your search or filters.",
        },
        error: {
            icon: "⚠️",
            title: "Something went wrong",
            description: "Unable to load users.",
        },
    }

    const config = stateConfig[type];

    if(!config) return null;

    return (
        <div
            className={styles.container}
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
        >
            {type === "loading" ? (
                <div
                    className={styles.spinner}
                    aria-hidden="true"
                />
            ) : (
                <span className={styles.icon} aria-hidden="true">
                    {config.icon}
                </span>
            )}
            <h3 className={styles.title}>
                {config.title}
            </h3>
            <p className={styles.description}>
                {message || config.description}
            </p>

            {type === "error" && onRetry && (
                <button
                    type="button"
                    className={styles.button}
                    onClick={onRetry}
                >
                    Retry
                </button>
            )}
            {type === "empty" && onClear && (
                <button
                    type="button"
                    className={styles.button}
                    onClick={onClear}
                >
                    Clear Filters
                </button>
            )}            

        </div>
    );

}