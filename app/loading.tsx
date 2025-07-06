import React from "react";
import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <div className="container mx-auto px-5 sm:px-0">
      <div className="py-5">
        {/* Search and Filter Skeleton */}
        <div className="flex gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      <div className="flex flex-col gap-5 w-full">
        {/* Perfumes Section */}
        <section className="w-full">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="min-w-[200px] border rounded-lg shadow space-y-1">
                <Skeleton className="w-full h-[200px] rounded-t-lg" />
                <div className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mists Section */}
        <section className="w-full">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="min-w-[200px] border rounded-lg shadow space-y-1">
                <Skeleton className="w-full h-[200px] rounded-t-lg" />
                <div className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Combos Section */}
        <section className="w-full">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="flex overflow-x-auto gap-4 pb-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="min-w-[200px] p-4 border rounded-lg shadow">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Loading;
