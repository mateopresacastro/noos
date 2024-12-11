"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    router.replace(`search/?${params.toString()}`);
  }, 300);

  return (
    <Input
      className="w-full max-w-80 bg-neutral-900 rounded-full mx-10"
      onChange={(e) => {
        handleSearch(e.target.value);
      }}
      placeholder="Search..."
      defaultValue={searchParams.get("q")?.toString()}
    />
  );
}
