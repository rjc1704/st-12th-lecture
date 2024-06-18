import { useInfiniteQuery } from "@tanstack/react-query";
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
      return {
        todos: response.data,
        totalPages: Math.ceil(
          response.headers["x-total-count"] / ITEMS_PER_PAGE,
        ),
      };
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const nextPage = lastPageParam + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    select: ({ pages }) =>
      pages.map((todosPerPage) => todosPerPage.todos).flat(),
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
      <ul style={{ listStyle: "none", width: 250 }}>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "로딩중..." : "더보기"}
        </button>
      )}
    </>
  );
}
