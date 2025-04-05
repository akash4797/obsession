"use client";
import React from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  const getHeaderText = () => {
    switch (pathname) {
      case "/":
        return "Product";
      case "/orderlist":
        return "Order List";
      case "/orders":
        return "Orders";
      default:
        return "Header";
    }
  };

  return (
    <div className="bg-gray-800 text-white py-3 px-5 text-lg font-semibold">
      {getHeaderText()}
    </div>
  );
};

export default Header;
