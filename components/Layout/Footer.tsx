"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { orderCountAtom } from "@/store/orderlist";

const Footer = () => {
  const pathname = usePathname();
  const orderCount = useAtom(orderCountAtom);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center bg-white shadow-lg">
      <Link href="/" className="w-full bg-gray-800">
        <button
          className={`px-4 py-2 text-white rounded w-full ${
            pathname === "/" ? "bg-purple-500" : ""
          }`}
        >
          Products
        </button>
      </Link>
      <Link href="/orderlist" className="w-full bg-gray-800 relative">
        {orderCount[0] > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {orderCount[0]}
          </span>
        )}
        <button
          className={`px-4 py-2 text-white w-full ${
            pathname === "/orderlist" ? "bg-purple-500" : ""
          }`}
        >
          Order List
        </button>
      </Link>
      <Link href="/orders" className="w-full bg-gray-800">
        <button
          className={`px-4 py-2 w-full text-white rounded ${
            pathname === "/orders" ? "bg-purple-500" : ""
          }`}
        >
          Orders
        </button>
      </Link>
    </div>
  );
};

export default Footer;
