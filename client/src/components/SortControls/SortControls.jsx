import styles from "./SortControls.module.css";

export default function SortControls({
    sortField,
    onSortFieldChange,
    sortDirection,
    onSortDirectionChange,
}) {
    return (
        <div className={styles.container}>
            <div className={styles.control}>
                <label htmlFor="sortField">Sort By</label>
                <select 
                    id="sortField"
                    value={sortField}
                    onChange={(event) => onSortFieldChange(event.target.value)}
                    className={styles.select}
                >
                    <option value="name">Name</option>
                    <option value="age">Age</option>
                    <option value="nationality">Nationality</option>
                </select>
            </div>
            <div className={styles.control}>
                <label htmlFor="sortDirection">Direction</label>
                <select 
                    id="sortDirection"
                    value={sortDirection}
                    onChange={(event) => onSortDirectionChange(event.target.value)}
                    className={styles.select}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>            

        </div>
    );
}
