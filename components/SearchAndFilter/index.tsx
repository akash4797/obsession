"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { searchAtom, filterGenderAtom } from "@/store/search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchAndFilter = () => {
  const [search, setSearch] = useAtom(searchAtom);
  const [filterGender, setFilterGender] = useAtom(filterGenderAtom);

  return (
    <div className="flex gap-4">
      <Input
        placeholder="Search Products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        value={filterGender}
        onValueChange={(value) => setFilterGender(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="unigender">Uni Gender</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchAndFilter;
