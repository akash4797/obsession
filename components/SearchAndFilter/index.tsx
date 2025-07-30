"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterGenderAtom, searchAtom } from "@/store/search";
import { useAtom } from "jotai";
import { X } from "lucide-react";

const SearchAndFilter = () => {
  const [search, setSearch] = useAtom(searchAtom);
  const [filterGender, setFilterGender] = useAtom(filterGenderAtom);

  const handleClearSearch = () => {
    setSearch("");
  };

  return (
    <div className="flex gap-4">
      <div className="w-full relative">
        <Input
          placeholder="Search Products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant={"ghost"} size={"icon"} className="rounded-full absolute top-1/2 right-2 -translate-y-1/2" onClick={handleClearSearch}>
          <X className="h-4 w-4" />
        </Button>
      </div>
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
