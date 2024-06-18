import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

function TodoItem({ todo }, ref) {
  const navigate = useNavigate();
  return (
    <li
      ref={ref}
      key={todo.id}
      style={{
        border: "1px solid black",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <h3>{todo.title}</h3>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => navigate(`/detail/${todo.id}`)}>내용보기</button>
      </div>
    </li>
  );
}

export default forwardRef(TodoItem);
