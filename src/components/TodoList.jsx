import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { todoApi } from "../api/todos";
import Pagination from "./Pagination";
import TodoItem from "./TodoItem";

const ITEMS_PER_PAGE = 4;

export default function TodoList() {
  const [page, setPage] = useState(1);

  const { isPending, error, data } = useQuery({
    queryKey: ["todos", page],
    queryFn: async () => {
      const response = await todoApi.get("/todos", {
        params: { _page: page, _limit: ITEMS_PER_PAGE },
      });
      return {
        todos: response.data,
        totalCount: response.headers["x-total-count"],
      };
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

  const totalPages = Math.ceil(data.totalCount / ITEMS_PER_PAGE);

  return (
    <>
      <ul style={{ listStyle: "none", width: 250 }}>
        {data.todos.map((todo) => (
          <TodoItem todo={todo} />
        ))}
      </ul>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </>
  );
}
