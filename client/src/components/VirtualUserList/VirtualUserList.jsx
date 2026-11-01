import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import UserCard from "../UserCard/UserCard";
import styles from "./VirtualUserList.module.css";

const PAGE_SIZE = 20;
const SCROLL_THRESHOLD = 200;

export default function VirtualUserList({users}) {

    const scrollRef = useRef(null);

    const [loadedCount, setLoadedCount] = useState(PAGE_SIZE);
    const loadedUsers = users.slice(0, loadedCount);
    const hasMore = loadedUsers.length < users.length;

    const virtualizer = useVirtualizer({
        count: loadedUsers.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 160,
        overscan: 5, 
        getItemKey: (index) => users[index].id,
    });

    useEffect(() => {
        virtualizer.scrollToOffset(0);
        virtualizer.measure();
    }, [users, virtualizer]);

    console.log(
        "Total users:", users.length,
        "Rendered rows:", virtualizer.getVirtualItems().length
    );

    function handleScroll(event) {
        const element = event.currentTarget;
        const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;

        if (distanceFromBottom <= SCROLL_THRESHOLD && hasMore) {
            setLoadedCount((previous) => Math.min(previous + PAGE_SIZE, users.length));
        }
    }

    return (
        <div className={styles.container}>
        <div
            ref={scrollRef}
            className={styles.scrollContainer}
            onScroll={handleScroll}
        >
            <div
                className={styles.virtualContent}
                style={{
                    height: virtualizer.getTotalSize(),
                }}
            >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const user = loadedUsers[virtualRow.index];
                    return (
                        <div
                            key={virtualRow.key}
                            data-index={virtualRow.index}
                            ref={virtualizer.measureElement}
                            className={styles.virtualRow}
                            style={{
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            <UserCard user={user} />
                        </div>
                    );
                })}

            </div>

        </div>

            <div className={styles.footer}>
                Showing {loadedUsers.length} of {users.length} users

                {!hasMore && (
                    <p>All users loaded</p>
                )}
            </div>
        </div>
    );
}