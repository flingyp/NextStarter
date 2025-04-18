# Zustand 与 Next.js 集成指南

Zustand 是一个轻量级、高性能的 React 状态管理库，以其简洁的 API 和灵活的架构著称。与 Next.js 结合使用时，可以轻松管理客户端状态，同时兼容服务端渲染(SSR)和静态生成(SSG)的特性。

## 安装

首先，将 Zustand 添加到你的项目依赖中：

```bash
pnpm add zustand
```

## 创建 Store

创建一个 Store 非常简单。通常，你会定义一个包含状态和更新函数的 Hook。

**示例 (`store/useCountStore.ts`):**

```typescript
import { create } from "zustand";

// 定义状态的类型
interface CountState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  incrementByAmount: (amount: number) => void;
}

// 创建store
const useCountStore = create<CountState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  incrementByAmount: (amount) =>
    set((state) => ({ count: state.count + amount })),
}));

export default useCountStore;
```

在这个例子中：

1.  我们导入 `create` 函数。
2.  定义了 `CountState` 接口来描述 Store 的状态结构。
3.  使用 `create` 创建了一个名为 `useCountStore` 的 Hook。
4.  `set` 函数用于更新状态。

项目中还包含另一个示例 Store: `store/useTodoStore.ts`。

## 在 React 组件中使用 Store

在你的 React 组件中，可以直接导入并使用创建的 Store Hook。

**示例 (`app/zustand-demo/page.tsx`):**

```tsx
"use client"; // 标记为客户端组件

import useCountStore from "@/store/useCountStore";

export default function ZustandDemoPage() {
  // 使用 Hook 获取状态和操作
  const { count, increment, decrement, reset } = useCountStore();

  return (
    <div>
      <h1>Zustand Demo</h1>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

**关键点:**

- **客户端组件:** 由于 Zustand 主要用于管理客户端状态，包含 Zustand Store 的组件通常需要标记为客户端组件 (`'use client'`)。
- **直接使用:** 直接调用 Store Hook (`useCountStore()`) 即可访问状态 (`count`) 和操作函数 (`increment`, `decrement`, `reset`)。

## 与 Next.js 特性结合 (SSR/SSG)

Zustand 本身是客户端状态管理库。在 Next.js 中使用时，需要注意：

- **默认行为:** Store 的初始状态是在客户端首次渲染时创建的。
- **SSR/SSG 兼容性:**
  - 对于不需要在服务端预渲染的状态，直接在客户端组件中使用 Zustand 即可。
  - 如果需要在服务端获取初始状态（例如，从 API 获取数据填充 Store），或者处理 hydration 问题，可能需要更复杂的设置，例如结合 `useEffect` 在客户端初始化状态，或者使用 Zustand 的持久化中间件（如果需要本地存储）。
  - 对于简单的客户端交互状态（如本例中的计数器），通常不需要特殊处理。

## 状态持久化 (Persistence)

Zustand 提供了 `persist` 中间件，可以轻松地将 Store 的状态持久化到 `localStorage`、`sessionStorage` 或其他存储中。

**使用方法:**

1.  **导入 `persist` 和 `createJSONStorage`:**

    ```typescript
    import { create } from "zustand";
    import { persist, createJSONStorage } from "zustand/middleware";
    ```

2.  **包裹 Store 创建函数:**

    使用 `persist()` 函数包裹你的 `(set, get) => ({...})` 定义。

3.  **配置选项:**

    `persist` 函数接受第二个参数作为配置对象：

    - `name`: (必需) 用于存储的唯一键名。
    - `storage`: (可选) 指定存储引擎。`createJSONStorage(() => localStorage)` 是常用的选择，它使用 `localStorage` 并自动处理 JSON 序列化/反序列化。你也可以使用 `sessionStorage` 或自定义存储。

**示例 (`store/useTodoStore.ts`):**

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Todo {
  /* ... */
}

interface TodoState {
  /* ... */
}

const useTodoStore = create(
  persist<TodoState>(
    (set) => ({
      todos: [],
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: Date.now().toString(), text, completed: false },
          ],
        })),
      // ... 其他 actions
    }),
    {
      name: "todo-storage", // 持久化存储的键名
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
    }
  )
);

export default useTodoStore;
```

通过这种方式，`useTodoStore` 的状态（`todos` 数组）将在浏览器刷新或关闭后仍然保留。

## 最佳实践

- **保持 Store 简洁:** 每个 Store 专注于特定的状态领域。
- **合理组织:** 将相关的 Store 文件放在 `store` 目录下。
- **类型安全:** 使用 TypeScript 定义状态接口，提高代码健壮性。

参考项目中的 `store/useCountStore.ts`, `store/useTodoStore.ts` 和 `app/zustand-demo/page.tsx` 获取具体实现示例。
