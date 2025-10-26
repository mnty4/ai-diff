import { ReactNode, RefObject, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Pagination<T>({
  initialItems,
  fetchPage,
  renderItem,
  loader,
  pageSize,
  scrollContainerRef,
}: {
  initialItems: T[];
  fetchPage: (page: number) => Promise<T[]>;
  renderItem: (item: T) => ReactNode;
  loader: ReactNode;
  pageSize: number;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: "0px 0px 100% 0px",
    root: scrollContainerRef?.current,
  });

  useEffect(() => {
    if (!inView) return;
    (async () => {
      const newItems = await fetchPage(page + 1);
      if (newItems.length < pageSize) {
        console.log(newItems.length, pageSize);
        setHasMore(false);
      }
      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    })();
  }, [fetchPage, inView, page, pageSize]);
  return (
    <>
      {items.map(renderItem)}
      {hasMore && (
        <div ref={ref} key={"loading"}>
          {loader}
        </div>
      )}
    </>
  );
}
