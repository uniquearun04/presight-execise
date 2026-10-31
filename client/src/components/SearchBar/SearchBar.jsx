
import styles from "./SearchBar.module.css";

export default function SearchBar({value, onChange}) {
    return (
        <div className={styles.searchContainer}>
            <input
                type="search"
                placeholder="Search by first name or last name..."
                aria-label="Search by name"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={styles.searchInput}
            />
        </div>
    );
}