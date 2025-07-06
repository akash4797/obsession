import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto px-5 pt-5 pb-14">
      {/* Search input skeleton */}
      <div className="mb-4">
        <Skeleton className="w-full h-10" />
      </div>
      
      {/* Order list skeleton */}
      <div className="space-y-4">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="border rounded overflow-hidden">
            {/* Accordion header skeleton */}
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <div className="flex flex-col gap-1 items-start justify-center w-full">
                <div className="flex items-center gap-2 w-full">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-40 mt-1" />
              </div>
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            
            {/* First item expanded to show content skeleton */}
            {index === 0 && (
              <div className="p-4 border-t-0 border-gray-800">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-10 rounded-full" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                  <Skeleton className="h-9 w-36" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;