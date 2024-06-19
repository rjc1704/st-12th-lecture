import { useQuery } from "@tanstack/react-query";
import { todoApi } from "../api/todos";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function Home() {
  return (
    <>
      <h2>투두리스트 (페이지네이션)</h2>
      <TodoForm />
      <TodoList />
    </>
  );
}
