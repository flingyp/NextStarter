# 表单页面文档

本文档解释了位于 `/app/form/page.tsx` 的表单页面的实现。

## 概述

该表单页面演示了几个关键库的集成，以创建一个健壮且类型安全的表单：

- **shadcn/ui**: 用于 UI 组件（Form、Input、Button 等）。
- **React Hook Form**: 处理表单状态管理、验证和提交。
- **Zod**: 定义用于表单数据验证的模式。

## 实现细节

1.  **模式定义 (`zod`)**:
    使用 Zod 定义了一个模式 (`formSchema`)，以指定表单数据的结构和验证规则。在此示例中，它需要一个 `username` 字段，该字段必须是至少包含 2 个字符的字符串。

    ```typescript
    import { z } from "zod";

    const formSchema = z.object({
      username: z.string().min(2, {
        message: "用户名必须至少包含 2 个字符。",
      }),
    });
    ```

2.  **表单初始化 (`react-hook-form`)**:
    使用 React Hook Form 中的 `useForm` 钩子来初始化表单。

    - `resolver`: 传递 `zodResolver` 以集成 Zod 模式验证。
    - `defaultValues`: 设置表单字段的初始值。

    ```typescript
    import { useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
      },
    });
    ```

3.  **表单结构 (`shadcn/ui`)**:
    表单是使用 `shadcn/ui` 中的组件构建的：

    - `<Form {...form}>`: 主表单提供者组件，传递表单实例。
    - `<form onSubmit={form.handleSubmit(onSubmit)}>`: 原生 HTML 表单元素。`form.handleSubmit` 包装了 `onSubmit` 函数，确保在提交前进行验证。
    - `<FormField>`: 将特定表单字段连接到 React Hook Form 状态管理的组件。
      - `control`: 从 `form` 实例传递。
      - `name`: 字段的名称，与 Zod 模式匹配。
      - `render`: 一个接收字段状态和方法的函数，用于渲染实际的输入组件。
    - `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormDescription>`, `<FormMessage>`: 用于构建和显示字段的标签、输入、描述和验证消息的组件。
    - `<Input>`: 来自 `shadcn/ui` 的实际输入元素。
    - `<Button type="submit">`: 触发表单提交的按钮。

    ```tsx
    import { Button } from "@/components/ui/button";
    import {
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
    } from "@/components/ui/form";
    import { Input } from "@/components/ui/input";

    // ... 在组件内部
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>这是您的公开显示名称。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">提交</Button>
      </form>
    </Form>;
    ```

4.  **提交处理程序**:
    当表单成功提交时，`onSubmit` 函数会接收经过验证的表单值（根据 Zod 模式进行类型化）。

    ```typescript
    function onSubmit(values: z.infer<typeof formSchema>) {
      // 对表单值执行某些操作。
      // ✅ 这将是类型安全且经过验证的。
      console.log(values);
      alert(`表单已提交！\n用户名: ${values.username}`);
    }
    ```

## 关键概念

- **声明式 UI**: `shadcn/ui` 提供预构建、可自定义的组件。
- **受控组件**: React Hook Form 管理表单输入的状态。
- **基于模式的验证**: Zod 在处理数据之前确保数据的完整性。
- **类型安全**: TypeScript 和 Zod 提供从模式定义到提交处理程序的端到端类型安全。

此设置提供了一种在 React 应用程序中处理表单的干净、高效且类型安全的方法。
