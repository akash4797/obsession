"use client";

import React from "react";
import { useOrders } from "@/hooks/fetchorders";
import ShowOrderList from "./ShowOrderList";
import { Loader2 } from "lucide-react";

const Orders = () => {
  const { orders, isLoading, isError, refresh } = useOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading orders</div>;
  }

  return (
    <div className="container mx-auto px-5 pt-5 pb-14">
      <ShowOrderList orders={orders} refresh={refresh} />
    </div>
  );
};

export default Orders;
