# 基于 Next.js App Router 实现了国际化

- [官方文档](https://nextjscn.org/docs/app/building-your-application/routing/internationalization)

项目采用了基于路由的国际化方案，主要特点：

- 使用动态路由参数 `[lang]` 来标识不同语言
- 通过中间件自动检测用户语言并重定向到对应语言路由
- 支持多语言切换
- 翻译文件采用 JSON 格式存储

## 项目结构

```
├── app/
│   ├── [lang]/           # 动态语言路由
│   │   └── page.tsx      # 页面组件
│   └── layout.tsx        # 根布局
├── lib/
│   └── locales.ts        # 语言配置
├── locales/              # 翻译文件
│   ├── en.json           # 英文翻译
│   └── zh_CN.json           # 中文翻译
├── middleware.ts         # 国际化中间件
└── next.config.ts        # Next.js 配置
```

## 集成步骤

1. 安装依赖

```bash
pnpm add @formatjs/intl-localematcher negotiator
pnpm add @types/negotiator -D
```

2. 定义支持的语言

在 `lib/locales.ts` 中定义支持的语言和默认语言

3. 创建翻译文件

在 `locales` 目录下创建翻译文件，文件命名格式为 `[lang].json`

4. 创建中间件

在 `middleware.ts` 中实现自动检测用户语言并重定向到对应语言路由

5. 创建动态路由

在 `app` 目录下创建 `[lang]` 动态路由文件夹，用于处理不同语言的路由。

6. 在页面中使用翻译

```tsx
import { getLocale, LocalKey } from "@/lib/locales";

type Params = {
  lang: LocalKey;
};

export default async function Home({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  const localeDict = await getLocale(lang);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1>{localeDict["Next Starter"]}</h1>
    </div>
  );
}
```

7. 实现切换语言组件 `SwitchLanguage`
