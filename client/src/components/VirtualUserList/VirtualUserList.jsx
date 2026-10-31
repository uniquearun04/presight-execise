import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import UserCard from "../UserCard/UserCard";
import styles from "./VirtualUserList.module.css";

export default function VirtualUserList({users}) {

    const scrollRef = useRef(null);

    const virtualizer = useVirtualizer({
        count: users.length,
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
    return (
        <div
            ref={scrollRef}
            className={styles.scrollContainer}
        >
            <div
                className={styles.virtualContent}
                style={{
                    height: virtualizer.getTotalSize(),
                }}
            >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const user = users[virtualRow.index];
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
    );
}