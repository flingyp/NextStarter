import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 定义Todo项的类型
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// 定义Todo状态的类型
interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  clearCompleted: () => void;
}

// 创建持久化的Todo store
const useTodoStore = create(
  // 使用persist中间件实现状态持久化
  persist<TodoState>(
    (set) => ({
      todos: [],

      // 添加新的待办事项
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: Date.now().toString(),
              text,
              completed: false,
            },
          ],
        })),

      // 移除待办事项
      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      // 切换待办事项的完成状态
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),

      // 编辑待办事项的文本
      editTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text } : todo
          ),
        })),

      // 清除所有已完成的待办事项
      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),
    }),
    {
      name: "todo-storage", // 存储的键名
      storage: createJSONStorage(() => localStorage), // 使用localStorage进行存储
    }
  )
);

export default useTodoStore;
