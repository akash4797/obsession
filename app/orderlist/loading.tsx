import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto px-5 pt-5 pb-14">
      <div className="space-y-4">
        {/* Skeleton for accordion items */}
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="border rounded overflow-hidden">
            {/* Accordion header skeleton */}
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <div className="flex flex-col gap-1 items-start justify-center w-full">
                <div className="flex items-center gap-2 w-full">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-28 mt-1" />
              </div>
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            
            {/* First item expanded to show content skeleton */}
            {index === 0 && (
              <div className="p-4 border-t-0 border-gray-800">
                <div className="space-y-4">
                  {/* Customer info fields */}
                  <div className="grid gap-4 py-4 rounded-lg">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  
                  {/* Products */}
                  {Array(2).fill(0).map((_, productIndex) => (
                    <div key={productIndex} className="flex items-center justify-between border-b pb-2">
                      <div className="w-1/2">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-6 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                  
                  {/* Note field */}
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-8 w-64" />
                  </div>
                  
                  {/* Pricing fields */}
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex justify-between mt-4">
                      <Skeleton className="h-10 w-10" />
                      <div className="flex gap-2">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </div>
                  </div>
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