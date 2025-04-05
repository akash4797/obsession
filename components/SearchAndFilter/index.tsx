"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { searchAtom } from "@/store/search";

const SearchAndFilter = () => {
  const [search, setSearch] = useAtom(searchAtom);
  return (
    <div>
      <Input
        placeholder="Search Products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchAndFilter;
