import { useNavigate } from "react-router-dom";

export default function TodoItem({ todo }) {
  const navigate = useNavigate();
  return (
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
        <button onClick={() => navigate(`/detail/${todo.id}`)}>내용보기</button>
      </div>
    </li>
  );
}
