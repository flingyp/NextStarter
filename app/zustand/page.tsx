"use client";

import { useState } from "react";
import useCountStore from "@/store/useCountStore";
import useTodoStore from "@/store/useTodoStore";
import { Button } from "@/components/ui/button";

export default function Zustand() {
  // 使用计数器store
  const { count, increment, decrement, reset, incrementByAmount } =
    useCountStore();

  // 自定义增加数量的状态
  const [incrementAmount, setIncrementAmount] = useState(5);

  // 使用待办事项store
  const { todos, addTodo, removeTodo, toggleTodo, clearCompleted } =
    useTodoStore();
  const [newTodo, setNewTodo] = useState("");

  // 添加待办事项的处理函数
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo("");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Zustand 状态管理演示</h1>

      {/* 计数器示例 */}
      <div className="mb-12 p-6 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">计数器示例</h2>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={decrement}>
            -
          </Button>
          <span className="text-2xl font-bold">{count}</span>
          <Button variant="outline" onClick={increment}>
            +
          </Button>
          <Button variant="secondary" onClick={reset} className="ml-4">
            重置
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="number"
            value={incrementAmount}
            onChange={(e) => setIncrementAmount(Number(e.target.value))}
            className="border rounded px-3 py-2 w-20 text-center"
          />
          <Button
            onClick={() => incrementByAmount(incrementAmount)}
            variant="default"
          >
            增加数量
          </Button>
        </div>
      </div>

      {/* 待办事项列表示例 */}
      <div className="p-6 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">待办事项列表示例</h2>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
            placeholder="添加新的待办事项..."
            className="flex-1 border rounded px-3 py-2"
          />
          <Button onClick={handleAddTodo}>添加</Button>
        </div>

        <ul className="space-y-2 mb-4">
          {todos.length === 0 ? (
            <li className="text-gray-500 dark:text-gray-400">暂无待办事项</li>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 p-2 border-b"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-5 w-5"
                />
                <span
                  className={`flex-1 ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeTodo(todo.id)}
                >
                  删除
                </Button>
              </li>
            ))
          )}
        </ul>

        {todos.length > 0 && (
          <Button variant="outline" onClick={clearCompleted}>
            清除已完成
          </Button>
        )}
      </div>
    </div>
  );
}
