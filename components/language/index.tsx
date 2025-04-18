"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { LocalKey } from "@/lib/locales";

export function SwitchLanguage() {
  const pathname = usePathname();
  const router = useRouter();

  // 获取当前语言
  const currentLang = pathname.split("/")[1] as LocalKey;

  // 获取当前路径中除语言外的部分
  const pathnameWithoutLang = pathname.split("/").slice(2).join("/");

  // 切换语言
  const switchLanguage = (locale: LocalKey) => {
    router.replace(`/${locale}/${pathnameWithoutLang}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">切换语言</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => switchLanguage("zh_CN")}
        >
          <span className={currentLang === "zh_CN" ? "font-bold" : ""}>
            中文
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => switchLanguage("en")}
        >
          <span className={currentLang === "en" ? "font-bold" : ""}>
            English
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
