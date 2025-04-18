import { getLocale, LocalKey } from "@/lib/locales";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Params = {
  lang: LocalKey;
};

export default async function Home({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  const localeDict = await getLocale(lang);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center space-y-2">
      <div>{localeDict["Next Starter"]}</div>
      <Button>
        <Link href="/zustand">{localeDict["Zustand 状态管理演示"]}</Link>
      </Button>
    </div>
  );
}
