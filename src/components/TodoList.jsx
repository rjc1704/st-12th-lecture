import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { todoApi } from "../api/todos";
import TodoItem from "./TodoItem";

const ITEMS_PER_PAGE = 4;

export default function TodoList() {
  const {
    data: todos,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    error,
  } = useInfiniteQuery({
    queryKey: ["todos"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await todoApi.get("/todos", {
        params: { _page: pageParam, _limit: ITEMS_PER_PAGE },
      });
      return response.data;
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const nextPage = lastPageParam + 1;
      return lastPage.length === ITEMS_PER_PAGE ? nextPage : undefined;
    },
    select: ({ pages }) => pages.flat(),
  });

  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  if (isPending) {
    return (
      <div style={{ fontSize: 36 }}>
        <p>로딩중...</p>
      </div>
    );
  }

  if (error) {
    console.error(error);
    return (
      <div style={{ fontSize: 24 }}>에러가 발생했습니다: {error.message}</div>
    );
  }

  return (
    <>
      <ul style={{ listStyle: "none", width: 250, backgroundColor: "beige" }}>
        {todos.map((todo, idx) => {
          const isLastItem = todos.length - 1 === idx;
          return (
            <TodoItem ref={isLastItem ? ref : null} key={todo.id} todo={todo} />
          );
        })}
      </ul>
    </>
  );
}
