import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Home = () => {
  const date = new Date();
  const month = date.toLocaleString("en-us", { month: "long" });
  const day = date.getDate();

  const { data, error, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-[10rem] font-bold text-[#0DA34E] animate-scaleUp">{month}</h1>
      <p className="text-[6rem] text-[#0DA34E] animate-scaleUp">'{day}</p>
    <div className="mt-8">
        <h2 className="text-2xl text-[#0DA34E]">Todo List</h2>
        <ul className="text-white">
          {data?.map(todo => (
            <li key={todo.id} className="text-lg">
              {todo.title} - {todo.completed ? 'Completed' : 'Not Completed'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
