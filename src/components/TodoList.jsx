import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { todoApi } from "../api/todos";
import { FaRegHeart, FaHeart } from "react-icons/fa";

export default function TodoList() {
  const navigate = useNavigate();

  const {
    isPending,
    error,
    data: todos,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      console.log("queryFn in Home");
      const response = await todoApi.get("/todos?_sort=-createdAt");
      return response.data;
    },
  });

  const queryClient = useQueryClient();
  const { mutate: handleLike } = useMutation({
    mutationFn: ({ id, currentLiked }) =>
      todoApi.patch(`/todos/${id}`, { liked: !currentLiked }),
    // onSuccess: () => {
    //   queryClient.invalidateQueries(["todos"]);
    // },
    onMutate: async ({ id, currentLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData(["todos"]);
      queryClient.setQueryData(["todos"], (oldTodos) =>
        oldTodos.map((todo) =>
          todo.id === id ? { ...todo, liked: !currentLiked } : todo,
        ),
      );

      return { previousTodos };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["todos"], context.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["todos"]);
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
      <ul style={{ listStyle: "none", width: 250 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{todo.title}</h3>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => navigate(`/detail/${todo.id}`)}>
                내용보기
              </button>
              {todo.liked ? (
                <FaHeart
                  onClick={() =>
                    handleLike({ id: todo.id, currentLiked: todo.liked })
                  }
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <FaRegHeart
                  onClick={() =>
                    handleLike({ id: todo.id, currentLiked: todo.liked })
                  }
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
