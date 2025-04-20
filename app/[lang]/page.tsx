"use client";

import { getLocale, LocalKey } from "@/lib/locales";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster, toast } from "sonner";

type Params = {
  lang: LocalKey;
};

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  const localeDict = await getLocale(lang);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center space-y-2">
      <div>{localeDict["Next Starter"]}</div>
      <Button>
        <Link href="/zustand">{localeDict["Zustand 状态管理演示"]}</Link>
      </Button>
      <Button onClick={() => toast.success("My first toast")}>
        {localeDict["打开 Toast"]}
      </Button>

      <Toaster richColors position="top-center" />
    </div>
  );
}
