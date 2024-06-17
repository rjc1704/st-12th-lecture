import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { todoApi } from "../api/todos";

export default function TodoList() {
  const navigate = useNavigate();

  const {
    isFetching,
    error,
    data: todos,
    refetch,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      console.log("queryFn in Home");
      const response = await todoApi.get("/todos?_sort=-createdAt");
      return response.data;
    },
    enabled: false,
  });

  if (isFetching) {
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
      <button onClick={refetch}>투두리스트 refetch</button>
      <ul style={{ listStyle: "none", width: 250 }}>
        {todos?.map((todo) => (
          <li
            key={todo.id}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{todo.title}</h3>
            <button onClick={() => navigate(`/detail/${todo.id}`)}>
              내용보기
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
