# Next.js 与 Supabase 集成指南

本文档介绍了如何在 Next.js 项目中集成和使用 Supabase。

## 1. 安装 Supabase 客户端库

首先，你需要将 Supabase 的 JavaScript 客户端库添加到你的项目依赖中：

```bash
pnpm add @supabase/supabase-js
# 或者使用 npm
# npm install @supabase/supabase-js
# 或者使用 yarn
# yarn add @supabase/supabase-js
```

## 2. 配置环境变量

为了连接到你的 Supabase 项目，你需要获取项目的 URL 和匿名 (anon) 公钥。这些信息可以在你的 Supabase 项目设置的 API 部分找到。

在你的项目根目录下创建一个 `.env.local` 文件（如果还没有的话），并添加以下环境变量：

```plaintext
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

**重要提示：**

- 将 `YOUR_SUPABASE_URL` 和 `YOUR_SUPABASE_ANON_KEY` 替换为你自己项目的实际值。
- 使用 `NEXT_PUBLIC_` 前缀是为了让这些环境变量在浏览器端（客户端组件）也能访问到。请注意，匿名密钥是公开的，可以安全地暴露在客户端。但对于需要更高权限的操作（如写入数据），通常建议在服务器端（Server Components, API Routes, or Server Actions）使用服务角色密钥 (Service Role Key)，并确保该密钥**不**加 `NEXT_PUBLIC_` 前缀，以防泄露。

## 3. 初始化 Supabase 客户端

你可以在需要访问 Supabase 的地方初始化客户端。`app/supabase/page.tsx` 文件提供了一个在客户端组件中初始化的示例。

```typescript
// app/supabase/page.tsx
"use client";

import { createClient } from "@supabase/supabase-js";

// 从环境变量读取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 初始化 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ... 组件的其他部分
```

**注意：** 在客户端组件中直接使用 `createClient` 适用于读取公共数据或基于用户登录状态的操作。对于敏感操作或需要服务密钥的场景，请考虑在服务器端进行。

## 4. 示例：获取数据 (`app/supabase/page.tsx`)

`app/supabase/page.tsx` 文件演示了如何从 Supabase 数据库中获取数据并在页面上展示。

- **状态管理：** 使用 `useState` 来存储获取到的数据 (`todos`)、加载状态 (`loading`) 和错误信息 (`error`)。
- **数据获取：** 使用 `useEffect` 在组件挂载时异步获取数据。调用 `supabase.from('your_table_name').select('*')` 来查询指定表的所有数据。
- **错误处理：** 使用 `try...catch` 块来捕获和处理潜在的错误。
- **UI 展示：** 根据加载状态、错误状态和获取到的数据来渲染不同的 UI。

```typescript
// ... (导入和客户端初始化)

interface Todo {
  // 定义数据类型，根据你的表结构调整
  id: number;
  task: string;
  is_completed: boolean;
  inserted_at: string;
}

export default function SupabasePage() {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError(null);
      try {
        // 替换 'todos' 为你的实际表名
        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .order("inserted_at", { ascending: false });

        if (error) throw error;
        setTodos(data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(`获取数据失败: ${err.message}. 请检查配置和 RLS 策略。`);
        setTodos(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // ... (JSX 用于渲染 UI)
}
```

## 5. 行级安全 (Row Level Security - RLS)

Supabase 默认启用 RLS。这意味着你需要为你的表设置策略，明确允许哪些操作（SELECT, INSERT, UPDATE, DELETE）可以被执行，以及由谁执行（例如，匿名用户、已登录用户等）。

如果你在获取数据时遇到权限错误，请检查你的 Supabase 项目中的 RLS 策略设置。对于示例中的匿名读取，你需要创建一个允许 `anon` 角色执行 `SELECT` 操作的策略。

## 6. 认证功能

Supabase 提供了完整的认证系统，支持多种登录方式。以下是基本的邮箱+密码注册和登录实现步骤：

1. **在客户端组件中添加注册和登录表单**

```typescript
// 示例代码片段 - 完整实现见 app/supabase/page.tsx
const [auth, setAuth] = useState({
  email: "",
  password: "",
  user: null,
  error: null,
});

// 处理登录
const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: auth.email,
    password: auth.password,
  });

  if (error) {
    setAuth({ ...auth, error: error.message });
  } else {
    setAuth({ ...auth, user: data.user, error: null });
  }
};

// 处理注册
const handleSignUp = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: auth.email,
    password: auth.password,
  });

  if (error) {
    setAuth({ ...auth, error: error.message });
  } else {
    setAuth({ ...auth, user: data.user, error: null });
  }
};

// 处理登出
const handleLogout = async () => {
  await supabase.auth.signOut();
  setAuth({ email: "", password: "", user: null, error: null });
};
```

2. **在 Supabase 控制台启用邮箱/密码认证**

- 登录 Supabase 控制台
- 导航到 "Authentication" > "Providers"
- 启用 "Email" 提供者
- 配置 "Password" 设置

3. **行级安全(RLS)注意事项**

- 确保为认证用户设置适当的 RLS 策略
- 示例策略：`auth.uid() = user_id` 限制用户只能访问自己的数据

## 7. 验证码登录功能

Supabase 支持通过邮箱验证码进行登录，以下是实现步骤：

1. **发送验证码**

```typescript
// 示例代码片段
const handleSendCode = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "https://your-app.com/auth/callback",
    },
  });

  if (error) {
    console.error("发送验证码失败:", error);
    return { error: error.message };
  }
  return { data };
};
```

2. **验证码验证**

```typescript
// 示例代码片段
const handleVerifyCode = async (email: string, code: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });

  if (error) {
    console.error("验证失败:", error);
    return { error: error.message };
  }
  return { data };
};
```

3. **错误处理**

- 验证码过期：默认有效期为 24 小时
- 验证码错误：会返回特定错误信息
- 发送频率限制：防止滥用

4. **与密码登录的区别**

- 无需用户记住密码
- 更安全的登录方式
- 需要额外处理验证码发送和验证流程

## 8. 服务器端集成

对于需要在服务器端执行的操作（例如，使用服务密钥进行写操作、在 Server Components 中获取数据），你可以：

- **在 Server Components 中：** 直接导入 `@supabase/supabase-js` 并使用 `createClient`，传入 URL 和 **服务角色密钥**（从环境变量读取，**不要**加 `NEXT_PUBLIC_` 前缀）。
- **在 API Routes 中：** 创建一个 API 路由 (e.g., `app/api/supabase/route.ts`)，在其中初始化客户端并处理请求。
- **使用 Server Actions：** 在 Server Action 函数中初始化客户端并执行数据库操作。

有关更高级的用法和服务器端集成，请参阅 [Supabase Next.js 文档](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)。
