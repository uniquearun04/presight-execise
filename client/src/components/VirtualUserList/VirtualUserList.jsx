import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import UserCard from "../UserCard/UserCard";
import styles from "./VirtualUserList.module.css";

const SCROLL_THRESHOLD = 250;

export default function VirtualUserList({
    users,
    hasMore,
    isLoadingMore,
    loadMoreError,
    onLoadMore,
    onRetry,
}) {

    const scrollRef = useRef(null);

    // const [loadedCount, setLoadedCount] = useState(PAGE_SIZE);
    // const loadedUsers = users.slice(0, loadedCount);
    // const hasMore = loadedUsers.length < users.length;

    const virtualizer = useVirtualizer({
        count: users.length + (hasMore ? 1 : 0),
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 160,
        overscan: 5, 
        getItemKey: (index) => users[index]?.id ?? "load-more",
    });

    // Check how close we are to the bottom
    function isNearBottom(element) {
        const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
        return distanceFromBottom <= SCROLL_THRESHOLD;
    }

    // Detect normal user scrolling
    function handleScroll(event) {
        if (!hasMore || isLoadingMore || loadMoreError) {
            return;
        }

        if (isNearBottom(event.currentTarget)) {
            onLoadMore();
        }
    }

    useEffect(() => {
        const element = scrollRef.current;
        if (!element || !hasMore || isLoadingMore || loadMoreError) {
            return;
        }
        if (isNearBottom(element)) {
            onLoadMore();
        }
    }, [
        users.length,
        hasMore,
        isLoadingMore,
        loadMoreError,
        onLoadMore,
    ]);

    // useEffect(() => {
    //     virtualizer.scrollToOffset(0);
    //     virtualizer.measure();
    // }, [users, virtualizer]);

    // console.log(
    //     "Total users:", users.length,
    //     "Rendered rows:", virtualizer.getVirtualItems().length
    // );

    // function handleScroll(event) {
    //     const element = event.currentTarget;
    //     const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;

    //     if (distanceFromBottom <= SCROLL_THRESHOLD && hasMore) {
    //         setLoadedCount((previous) => Math.min(previous + PAGE_SIZE, users.length));
    //     }
    // }

    return (
        <div className={styles.container}>
        <div
            ref={scrollRef}
            className={styles.scrollContainer}
            onScroll={handleScroll}
            aria-label="User results"
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
                            {user ? (
                                <UserCard user={user}/>
                            ) : (
                                <div
                                    className={styles.loadMore}
                                    role="status"
                                >
                                    {isLoadingMore ? "Loading more users..." : "Scroll to load more"}
                                </div>
                            )}
                        </div>
                    );
                })}

            </div>

        </div>
        {loadMoreError && (
            <div className={styles.error} role="alert">
                <p>{loadMoreError}</p>
                <button
                        type="button"
                        className={styles.retryButton}
                        onClick={onRetry}
                    >
                        Retry loading
                    </button>
            </div>
        )}

            {/* <div className={styles.footer}>
                Showing {loadedUsers.length} of {users.length} users

                {!hasMore && (
                    <p>All users loaded</p>
                )}
            </div> */}
        </div>
    );
}