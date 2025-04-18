"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

// 确保在你的 .env.local 文件中设置了这些环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 初始化 Supabase 客户端
// 注意：在客户端组件中直接暴露密钥通常不推荐用于生产环境
// 考虑使用服务器组件或 API 路由来处理敏感操作
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 用户认证状态
interface AuthState {
  email: string;
  password: string;
  otp: string;
  user: any;
  error: string | null;
}

interface Todo {
  id: number;
  task: string;
  is_completed: boolean;
  inserted_at: string;
}

export default function SupabasePage() {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 认证状态
  const [auth, setAuth] = useState<AuthState>({
    email: "",
    password: "",
    otp: "",
    user: null,
    error: null,
  });

  useEffect(() => {
    const checkSession = async () => {
      // 检查本地存储中是否有会话
      const storedSession = localStorage.getItem("supabase.auth.session");

      if (storedSession) {
        const session = JSON.parse(storedSession);
        setAuth((prev) => ({
          ...prev,
          user: session.user,
          error: null,
        }));
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        // 存储会话到本地
        localStorage.setItem("supabase.auth.session", JSON.stringify(session));
        setAuth((prev) => ({
          ...prev,
          user: session.user,
          error: null,
        }));
      }
    };

    const fetchTodos = async () => {
      setLoading(true);
      setError(null);
      try {
        // 假设你有一个名为 'todos' 的表
        const { data, error } = await supabase
          .from("todos") // 替换为你的表名
          .select("*")
          .order("inserted_at", { ascending: false });

        if (error) {
          throw error;
        }

        setTodos(data);
      } catch (err: any) {
        console.error("Error fetching todos:", err);
        setError(
          `获取数据失败: ${err.message}. 请确保你的 Supabase 项目已设置并且 'todos' 表存在，并且已配置 RLS 策略允许匿名读取。`
        );
        setTodos(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    fetchTodos();
  }, []);

  // 发送验证码
  const handleSendOtp = async () => {
    const email = auth.email.trim();

    if (!email) {
      setAuth((prev) => ({
        ...prev,
        error: "请输入邮箱地址",
      }));
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setAuth((prev) => ({
        ...prev,
        error: "请输入有效的邮箱地址",
      }));
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/supabase`,
          shouldCreateUser: false, // 禁止自动创建用户

          // 邮箱 + 验证码登录：https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp
          // 修改模板以包含 {{ .Token }} 变量

          // 如果 shouldCreateUser 为 false，然后你提供的邮箱在数据库中不存在，
          // 则会返回一个错误，错误信息为 "Signups not allowed for otp"，
          // 如果 shouldCreateUser 为 false，然后你提供的邮箱在数据库中不存在，
          // 如果 shouldCreateUser 为 true，然后你提供的邮箱在数据库中不存在，
          // 则会自动创建一个用户，然后返回一个成功的响应，但是这个相应没有如何数据，
          // 然后需要你在页面中输入邮箱的验证码，然后再点击登录按钮，实现登录
        },
      });

      if (error) throw error;

      setAuth((prev) => ({
        ...prev,
        error: "验证码已发送，请检查您的邮箱",
      }));
    } catch (err: any) {
      setAuth((prev) => ({
        ...prev,
        error: err.message.includes("must be set")
          ? "请输入有效的邮箱地址"
          : err.message.includes("User not found")
          ? "用户不存在，请先注册"
          : err.message.includes("otp_disabled")
          ? "OTP验证功能未启用，请在Supabase控制台中启用邮箱验证码登录选项"
          : err.message,
      }));
    }
  };

  // 验证码登录
  const handleOtpLogin = async () => {
    if (!auth.email) {
      setAuth((prev) => ({
        ...prev,
        error: "请输入邮箱地址",
      }));
      return;
    }

    if (!auth.otp) {
      setAuth((prev) => ({
        ...prev,
        error: "请输入验证码",
      }));
      return;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: auth.email,
        token: auth.otp,
        type: "email",
      });

      if (error) throw error;

      // 存储会话到本地
      localStorage.setItem("supabase.auth.session", JSON.stringify(data));

      setAuth((prev) => ({
        ...prev,
        user: data.user,
        error: null,
      }));
    } catch (err: any) {
      setAuth((prev) => ({
        ...prev,
        error: err.message.includes("email")
          ? "请输入有效的邮箱地址"
          : err.message.includes("Token has expired")
          ? "验证码已过期，请重新获取"
          : err.message.includes("Invalid token")
          ? "验证码不正确，请重新输入"
          : err.message,
      }));
    }
  };

  // 处理注册
  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: auth.email,
        password: auth.password,
      });

      if (error) throw error;

      setAuth((prev) => ({
        ...prev,
        user: data.user,
        error: null,
      }));
    } catch (err: any) {
      setAuth((prev) => ({
        ...prev,
        error: err.message,
      }));
    }
  };

  // 处理登录
  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: auth.email,
        password: auth.password,
      });

      if (error) {
        if (error.message === "Email not confirmed") {
          throw new Error("请先验证您的邮箱，我们已发送验证邮件到您的邮箱");
        } else if (error.message === "Invalid login credentials") {
          throw new Error("邮箱或密码不正确，请检查后重试");
        }
        throw error;
      }

      setAuth((prev) => ({
        ...prev,
        user: data.user,
        error: null,
      }));
    } catch (err: any) {
      setAuth((prev) => ({
        ...prev,
        error: err.message,
      }));
    }
  };

  // 重新发送验证邮件
  const handleResendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: auth.email,
      });

      if (error) throw error;

      setAuth((prev) => ({
        ...prev,
        error: "验证邮件已重新发送，请检查您的邮箱",
      }));
    } catch (err: any) {
      setAuth((prev) => ({
        ...prev,
        error: err.message,
      }));
    }
  };

  // 处理登出
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuth((prev) => ({
        ...prev,
        error: error.message,
      }));
    } else {
      // 清除本地存储的会话
      localStorage.removeItem("supabase.auth.session");
      setAuth({
        email: "",
        password: "",
        user: null,
        error: null,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase 数据展示示例</h1>

      {/* 认证部分 */}
      {!auth.user ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">注册/登录</h2>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="邮箱"
              value={auth.email}
              onChange={(e) => setAuth({ ...auth, email: e.target.value })}
              className="border p-2 w-full"
            />
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="password"
                  placeholder="密码"
                  value={auth.password}
                  onChange={(e) =>
                    setAuth({ ...auth, password: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="验证码"
                  value={auth.otp}
                  onChange={(e) => setAuth({ ...auth, otp: e.target.value })}
                  className="border p-2 w-full"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSignUp}
                className="bg-green-500 text-white px-4 py-2 rounded flex-1"
              >
                注册
              </button>
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded flex-1"
              >
                密码登录
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSendOtp}
                className="bg-purple-500 text-white px-4 py-2 rounded flex-1"
              >
                发送验证码
              </button>
              <button
                onClick={handleOtpLogin}
                className="bg-yellow-500 text-white px-4 py-2 rounded flex-1"
              >
                验证码登录
              </button>
            </div>
            {auth.error && (
              <div className="space-y-2">
                <p className="text-red-500">{auth.error}</p>
                {auth.error.includes("验证") && (
                  <button
                    onClick={handleResendVerification}
                    className="text-blue-500 underline"
                  >
                    重新发送验证邮件
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <p>已登录为: {auth.user.email}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded mt-2"
          >
            登出
          </button>
        </div>
      )}

      {loading && <p>加载中...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {todos && todos.length > 0 && (
        <ul className="list-disc pl-5">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={todo.is_completed ? "line-through text-gray-500" : ""}
            >
              {todo.task}
            </li>
          ))}
        </ul>
      )}

      {todos && todos.length === 0 && !loading && (
        <p>没有找到待办事项。请确保 todos 表中有数据。</p>
      )}
    </div>
  );
}
