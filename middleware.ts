import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { defaultLocale, locales } from "./lib/locales";

// 获取首选区域设置，类似于上面的方法或使用库
function getLocale(request: NextRequest) {
  try {
    const acceptLanguage = request.headers.get("Accept-Language") as string;
    const headers = { "accept-language": acceptLanguage };
    const languages = new Negotiator({ headers }).languages();
    return match(languages, locales, defaultLocale);
  } catch (error) {
    console.log("error: ", error);
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  // 检查路径名中是否有任何支持的区域设置
  const { pathname } = request.nextUrl;

  // 忽略设置的区域设置
  if (pathname !== "/" && config.matcher.some((item) => pathname.match(item)))
    return;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // 如果没有区域设置则重定向
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // 例如，传入请求是 /products
  // 新的 URL 现在是 /en/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // 跳过所有内部路径 (_next)
    "/((?!_next).*)",
    // 跳过所有 API 路由
    "/api/:path*",
    // 可选：仅在根 (/) URL 上运行
    // '/'
  ],
};
