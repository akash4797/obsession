"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Order } from "@/lib/Skeleton";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface ShowOrderListProps {
  orders: Order[];
  refresh: (
    data?: { orders: Order[] },
    options?: { revalidate?: boolean }
  ) => Promise<void>;
}

const ShowOrderList = ({ orders, refresh }: ShowOrderListProps) => {
  const [showCopyModal, setShowCopyModal] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredOrders = React.useMemo(() => {
    return orders
      .filter((order) =>
        order.fields.customerText
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        // Sort by newest first using sys.id (which contains timestamp)
        return b.sys.id.localeCompare(a.sys.id);
      });
  }, [orders, searchQuery]);

  // Extract phone number from customer text
  const extractPhoneNumber = (text: string) => {
    const match = text.match(/Number: (\+?\d+)/);
    return match ? match[1] : null;
  };

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <Accordion type="single" collapsible className="space-y-4">
        {filteredOrders.map((order) => (
          <AccordionItem key={order.sys.id} value={order.sys.id}>
            <AccordionTrigger className="px-4 border rounded-b-none border-gray-500">
              <div className="flex flex-col gap-1 items-start justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold">
                    {order.fields.customerName}
                  </span>
                  {extractPhoneNumber(order.fields.customerText) && (
                    <span className="text-sm text-gray-500">
                      {extractPhoneNumber(order.fields.customerText)}
                    </span>
                  )}
                </div>
                <span className="text-sm">
                  Admin Delivery: {order.fields.adminDeliver ? "Yes" : "No"}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border border-gray-800 border-t-0 p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={order.fields.adminDeliver}
                    onCheckedChange={async (checked) => {
                      // Optimistically update the UI
                      const optimisticData = {
                        orders: orders.map((o) =>
                          o.sys.id === order.sys.id
                            ? {
                                ...o,
                                fields: { ...o.fields, adminDeliver: checked },
                              }
                            : o
                        ),
                      };

                      try {
                        // Optimistically update the cache
                        await refresh(optimisticData, { revalidate: false });

                        const response = await fetch(
                          "/api/adminDeliverChange",
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              orderId: order.sys.id,
                              adminDeliver: checked,
                            }),
                          }
                        );

                        if (!response.ok) throw new Error("Failed to update");

                        toast.success("Admin delivery status updated");
                        // Revalidate after successful update
                        refresh();
                      } catch (error) {
                        console.error(error);
                        toast.error("Failed to update admin delivery status");
                        // Revert optimistic update on error
                        refresh();
                      }
                    }}
                  />
                  <span>Admin Delivery</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowCopyModal(true);
                  }}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Order Details
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {showCopyModal && selectedOrder && (
        <AlertDialog open={showCopyModal} onOpenChange={setShowCopyModal}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Order Details</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium">For Customer</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      const textarea = e.currentTarget.parentElement
                        ?.nextElementSibling as HTMLTextAreaElement;
                      if (textarea) {
                        textarea.select();
                        textarea.setSelectionRange(0, 99999);
                        document.execCommand("copy");
                        toast.success("Copied to clipboard!");
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <textarea
                  readOnly
                  rows={6}
                  value={selectedOrder.fields.customerText}
                  className="w-full h-64 p-2 border rounded font-mono text-sm"
                  onClick={(e) => {
                    const textarea = e.currentTarget;
                    textarea.select();
                    textarea.setSelectionRange(0, 99999);
                  }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium">For Admin</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      const textarea = e.currentTarget.parentElement
                        ?.nextElementSibling as HTMLTextAreaElement;
                      if (textarea) {
                        textarea.select();
                        textarea.setSelectionRange(0, 99999);
                        document.execCommand("copy");
                        toast.success("Copied to clipboard!");
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <textarea
                  readOnly
                  rows={6}
                  value={selectedOrder.fields.adminText}
                  className="w-full h-64 p-2 border rounded font-mono text-sm"
                  onClick={(e) => {
                    const textarea = e.currentTarget;
                    textarea.select();
                    textarea.setSelectionRange(0, 99999);
                  }}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default ShowOrderList;
