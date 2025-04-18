# 集成 `next-themes` 实现主题切换

1. 安装依赖

```bash
pnpm add next-themes
```

2. 配置 `ThemeProvider` 组件，用于包裹应用并提供主题上下文

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

3. 在应用中集成 `ThemeProvider` 组件

在应用的根布局文件中引入并使用 `ThemeProvider`

```tsx
import { ThemeProvider } from "@/components/ThemeSwitch/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

4. 实现切换主题组件 `SwitchTheme` 组件
