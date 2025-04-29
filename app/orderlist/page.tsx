"use client";
import React, { useState } from "react";
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
import { useAtom } from "jotai";
import { orderListAtom } from "@/store/orderlist";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const OrderList = () => {
  const [orderList, setOrderList] = useAtom(orderListAtom);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number | null>(
    null
  );

  const handlePlaceOrder = async (
    order: (typeof orderList)[0],
    orderIndex: number
  ) => {
    if (!order.customerName?.trim()) {
      toast.error("Customer name is required");
      return;
    }
    if (!order.customerPhone?.trim()) {
      toast.error("Customer phone number is required");
      return;
    }
    if (!order.customerAddress?.trim()) {
      toast.error("Customer address is required");
      return;
    }
    if (!order.products?.length) {
      toast.error("Order must have at least one product");
      return;
    }
    const confirmAdminDeliver = window.confirm(
      "Do you want to mark this as admin delivery?"
    );

    try {
      const response = await fetch("/api/placeorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: order.customerName,
          customerText: formatOrderDetails(order, false),
          adminText: formatOrderDetails(order, true),
          adminDeliver: confirmAdminDeliver,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      // Remove the order from local storage
      const updatedOrderList = orderList.filter(
        (_, index) => index !== orderIndex
      );
      setOrderList(updatedOrderList);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    }
  };

  const formatOrderDetails = (
    order: (typeof orderList)[0],
    isAdmin: boolean
  ) => {
    let text = "Confirming your order\n\n";
    text += `Name: ${order.customerName}\n`;
    if (order.customerAddress) text += `Address: ${order.customerAddress}\n`;
    if (order.customerPhone) text += `Number: ${order.customerPhone}\n\n`;

    text += "Products\n";
    order.products?.forEach((product, index) => {
      if (product.type === "combo" && product.comboChoose) {
        text += `${index + 1}.${product.name} - ${product.price}\n`;
        product.comboChoose.forEach((item) => {
          text += `  • ${item.name} ${item.size} \n`;
        });
      } else {
        if (product.type === "Perfume" && product?.size === "30ml") {
          text += `${index + 1}.${product.name} (${product.type} ${
            product?.size
          }) - ${product.price}\n`;
        } else {
          text += `${index + 1}.${product.name} (${product.type}) - ${
            product.price
          }\n`;
        }
      }
    });

    text += "\n";
    text += order.deliveryCharge
      ? `DC - ${order.deliveryCharge}\n`
      : "DC - Free\n";
    if (order.discount && order.discount > 0) {
      text += `Discount - ${order.discount}\n`;
    }
    text += `\nTotal: ${calculateTotal(order)} taka\n`;
    if (isAdmin && order.note) {
      text += `\nNote: ${order.note}\n`;
    }
    text += "\n";
    text += isAdmin ? "Order taken by (A.A)" : "Thank you for ordering. ❤️";

    return text;
  };

  const handleIncreaseQuantity = (orderIndex: number, productIndex: number) => {
    const updatedOrderList = [...orderList];
    if (
      updatedOrderList[orderIndex]?.products?.[productIndex]?.quantity !==
      undefined
    ) {
      updatedOrderList[orderIndex].products[productIndex].quantity += 1;
    }
    setOrderList(updatedOrderList);
  };

  const handleDecreaseQuantity = (orderIndex: number, productIndex: number) => {
    const updatedOrderList = [...orderList];
    if (
      updatedOrderList[orderIndex]?.products?.[productIndex]?.quantity &&
      updatedOrderList[orderIndex]?.products?.[productIndex]?.quantity > 1
    ) {
      updatedOrderList[orderIndex].products[productIndex].quantity -= 1;
      setOrderList(updatedOrderList);
    }
  };

  const handleDeleteOrder = (orderIndex: number) => {
    const updatedOrderList = orderList.filter(
      (_, index) => index !== orderIndex
    );
    setOrderList(updatedOrderList);
  };

  const handleUpdateCustomer = (
    orderIndex: number,
    field: string,
    value: string
  ) => {
    const updatedOrderList = [...orderList];
    updatedOrderList[orderIndex] = {
      ...updatedOrderList[orderIndex],
      [field]: value,
    };
    setOrderList(updatedOrderList);
  };

  const handleUpdateDiscount = (orderIndex: number, value: string) => {
    const updatedOrderList = [...orderList];
    const discount = parseInt(value) || 0;
    updatedOrderList[orderIndex] = {
      ...updatedOrderList[orderIndex],
      discount,
    };
    setOrderList(updatedOrderList);
  };

  const calculateTotal = (order: (typeof orderList)[0]) => {
    const subtotal =
      order.products?.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      ) || 0;
    return subtotal + (order.deliveryCharge || 0) - (order.discount || 0);
  };

  const handleUpdateDeliveryCharge = (orderIndex: number, value: string) => {
    const updatedOrderList = [...orderList];
    const deliveryCharge = parseInt(value) || 0;
    updatedOrderList[orderIndex] = {
      ...updatedOrderList[orderIndex],
      deliveryCharge,
    };
    setOrderList(updatedOrderList);
  };

  const handleDeleteProduct = (orderIndex: number, productIndex: number) => {
    const updatedOrderList = [...orderList];
    if (updatedOrderList[orderIndex])
      updatedOrderList[orderIndex].products = updatedOrderList[
        orderIndex
      ].products?.filter((_, index) => index !== productIndex);
    setOrderList(updatedOrderList);
  };

  return (
    <div className="container mx-auto px-5 pt-5 pb-14">
      <Accordion type="single" collapsible className="space-y-4">
        {orderList.map((order, orderIndex) => (
          <AccordionItem key={orderIndex} value={`item-${orderIndex}`}>
            <AccordionTrigger className="px-4 border rounded-b-none border-gray-500">
              <div className="flex flex-col gap-1 items-start justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold">
                    {order.customerName}
                  </span>
                  {order.customerPhone && (
                    <span className="text-sm text-gray-500">
                      {order.customerPhone}
                    </span>
                  )}
                </div>
                <span className="text-sm">
                  Products: {order.products?.length || 0}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border border-gray-800 border-t-0 p-4">
              <div className="space-y-4">
                <div className="grid gap-4 py-4 rounded-lg">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={order.customerName}
                    onChange={(e) =>
                      handleUpdateCustomer(
                        orderIndex,
                        "customerName",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={order.customerPhone || ""}
                    onChange={(e) =>
                      handleUpdateCustomer(
                        orderIndex,
                        "customerPhone",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={order.customerAddress || ""}
                    onChange={(e) =>
                      handleUpdateCustomer(
                        orderIndex,
                        "customerAddress",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>

                {order.products?.map((product, productIndex) => (
                  <div
                    key={productIndex}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        Price: {product.price} Tk
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.quantity === 1 ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDeleteProduct(orderIndex, productIndex)
                          }
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDecreaseQuantity(orderIndex, productIndex)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                      <span className="w-8 text-center">
                        {product.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleIncreaseQuantity(orderIndex, productIndex)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center text-sm">
                  <span>Note:</span>
                  <input
                    type="text"
                    value={order.note || ""}
                    onChange={(e) =>
                      handleUpdateCustomer(orderIndex, "note", e.target.value)
                    }
                    className="w-64 p-1 border rounded text-right"
                    placeholder="Add a note"
                  />
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between items-center">
                    <span>Delivery Charge:</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={order.deliveryCharge || ""}
                      onChange={(e) =>
                        handleUpdateDeliveryCharge(orderIndex, e.target.value)
                      }
                      className="w-24 p-1 border rounded text-right"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Discount:</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={order.discount || ""}
                      onChange={(e) =>
                        handleUpdateDiscount(orderIndex, e.target.value)
                      }
                      className="w-24 p-1 border rounded text-right"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span>{calculateTotal(order)} Tk</span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteOrder(orderIndex)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedOrderIndex(orderIndex);
                          setShowCopyModal(true);
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handlePlaceOrder(order, orderIndex)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Place Order
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {showCopyModal && selectedOrderIndex !== null && (
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
                  value={formatOrderDetails(
                    orderList[selectedOrderIndex],
                    false
                  )}
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
                  value={formatOrderDetails(
                    orderList[selectedOrderIndex],
                    true
                  )}
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
    </div>
  );
};

export default OrderList;
