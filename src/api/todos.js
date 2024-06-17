import axios from "axios";

export const todoApi = axios.create({
  baseURL: "http://localhost:4000",
});

export const getDetail = async ({ queryKey }) => {
  const [_, id] = queryKey;

  const response = await todoApi(`/todos/${id}`);
  return response.data;
};
