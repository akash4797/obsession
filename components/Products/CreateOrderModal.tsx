"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
import { Product, Combo } from "@/lib/Skeleton";
import { useAtom } from "jotai";
import { orderListAtom } from "@/store/orderlist";
import { OrderItem } from "@/store/orderlist";
import { toast } from "sonner";
import { useFetchProducts } from "@/hooks/fetchProducts";

const CreateOrderModal = ({
  showOrderModal,
  setShowOrderModal,
  product,
}: {
  showOrderModal: boolean;
  setShowOrderModal: React.Dispatch<React.SetStateAction<boolean>>;
  product: Product | Combo | null;
}) => {
  const { products, loading, error } = useFetchProducts();
  const [orderList, setOrderList] = useAtom(orderListAtom);
  const [search, setSearch] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [comboSelections, setComboSelections] = useState<
    Array<{
      id: string;
      name: string;
      price: number;
    }>
  >([]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return null;

  const getAvailableProducts = (index: number) => {
    return products.filter(
      (p) =>
        !comboSelections
          .slice(0, index)
          .some((selection) => selection?.id === p.sys.id)
    );
  };

  const handleComboSelection = (productId: string, index: number) => {
    const selectedProduct = products.find((p) => p.sys.id === productId);
    if (!selectedProduct) return;

    const newSelections = [...comboSelections];
    newSelections[index] = {
      id: selectedProduct.sys.id,
      name: selectedProduct.fields.name,
      price:
        selectedProduct.fields.price30ml ||
        selectedProduct.fields.price120ml ||
        selectedProduct.fields.price10ml ||
        0,
    };
    setComboSelections(newSelections);
  };

  const handleSelectOrder = (order: OrderItem) => {
    setSelectedOrder(order);
  };

  const getProductPrice = () => {
    if ("price" in product.fields) {
      return product.fields.price;
    }
    if (selectedSize === "10ml") return product.fields.price10ml || 0;
    if (selectedSize === "30ml") return product.fields.price30ml || 0;
    if (selectedSize === "120ml") return product.fields.price120ml || 0;
    return 0;
  };

  const handleCreateOrder = () => {
    const newOrder: OrderItem = {
      id: orderList.length + 1,
      customerName: search,
      adminDeliver: false,
      products: [],
      totalCost: 0,
    };
    setOrderList([...orderList, newOrder]);
    setSelectedOrder(newOrder);
  };

  const resetForm = () => {
    setSearch("");
    setSelectedSize("");
    setQuantity(1);
    setSelectedOrder(null);
    setComboSelections([]);
  };

  // Add this function before the return statement
  const isFormValid = () => {
    if (quantity < 1) return false;
    if ("price" in product.fields) {
      if ("anyCombo" in product.fields && product.fields.anyCombo) {
        return (
          selectedOrder !== null &&
          comboSelections.length === Number(product.fields.anyCombo) &&
          comboSelections.every(
            (selection) =>
              selection !== undefined &&
              selection.id &&
              selection.name &&
              selection.price
          )
        );
      }
      return selectedOrder !== null;
    }
    if (
      !selectedSize &&
      (product.fields.price10ml ||
        product.fields.price30ml ||
        product.fields.price120ml)
    )
      return false;
    return selectedOrder !== null;
  };

  return (
    <AlertDialog
      open={showOrderModal}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
        setShowOrderModal(open);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add to orderlist</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="space-y-4">
          <div className="space-y-4 p-3 border border-gray-200 rounded-md">
            <h3 className="font-semibold">
              {product.fields.name}
              {"type" in product.fields ? `- ${product.fields.type}` : ""}
            </h3>
            <div className="flex flex-col gap-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Quantity
              </label>
              <input
                type="number"
                id="amount"
                inputMode="numeric"
                pattern="[0-9]*"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            {("price10ml" in product.fields ||
              "price30ml" in product.fields ||
              "price120ml" in product.fields) &&
              (product?.fields.price10ml ||
                product?.fields.price30ml ||
                product?.fields.price120ml) && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Select Size</label>
                  <div className="space-y-2">
                    {product?.fields.price10ml && (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="size"
                          value="10ml"
                          checked={selectedSize === "10ml"}
                          onChange={(e) => setSelectedSize(e.target.value)}
                        />
                        <span>10ml - {product?.fields.price10ml} Tk</span>
                      </label>
                    )}
                    {product?.fields.price30ml && (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="size"
                          value="30ml"
                          checked={selectedSize === "30ml"}
                          onChange={(e) => setSelectedSize(e.target.value)}
                        />
                        <span>30ml - {product.fields.price30ml} Tk</span>
                      </label>
                    )}
                    {product?.fields.price120ml && (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="size"
                          value="120ml"
                          checked={selectedSize === "120ml"}
                          onChange={(e) => setSelectedSize(e.target.value)}
                        />
                        <span>120ml - {product.fields.price120ml} Tk</span>
                      </label>
                    )}
                  </div>
                </div>
              )}
            {"price" in product.fields && (
              <div className="text-sm">Price: {product?.fields.price} Tk</div>
            )}

            {"price" in product.fields &&
              "anyCombo" in product.fields &&
              Number(product.fields.anyCombo) > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Select {product.fields.anyCombo} Products
                  </label>
                  <div className="space-y-2">
                    {Array.from({
                      length: Number(product.fields.anyCombo),
                    }).map((_, index) => (
                      <select
                        key={index}
                        value={comboSelections[index]?.id || ""}
                        onChange={(e) =>
                          handleComboSelection(e.target.value, index)
                        }
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="">Select Product {index + 1}</option>
                        {getAvailableProducts(index).map((p) => (
                          <option key={p.sys.id} value={p.sys.id}>
                            {p.fields.name}
                            {p.fields.price10ml
                              ? ` - 10ml: ${p.fields.price10ml}Tk`
                              : ""}
                            {p.fields.price30ml
                              ? ` - 30ml: ${p.fields.price30ml}Tk`
                              : ""}
                            {p.fields.price120ml
                              ? ` - 120ml: ${p.fields.price120ml}Tk`
                              : ""}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                </div>
              )}
          </div>
          <div className="space-y-4 p-3 border border-gray-200 rounded-md">
            <input
              type="text"
              placeholder="Search or Create Order"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />

            <div className="max-h-48 overflow-y-auto space-y-2">
              {orderList
                .filter((order) =>
                  order.customerName
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    className={`p-2 border rounded-md hover:bg-gray-50 cursor-pointer text-sm ${
                      selectedOrder?.id === order.id
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                  >
                    <div className="font-medium">{order.customerName}</div>
                    {order.customerPhone && (
                      <div className="text-sm text-gray-600">
                        {order.customerPhone}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {order.products?.length || 0} products
                    </div>
                  </div>
                ))}

              {search &&
                !orderList.some((order) =>
                  order.customerName
                    .toLowerCase()
                    .includes(search.toLowerCase())
                ) && (
                  <button
                    onClick={handleCreateOrder}
                    className={`w-full p-2 text-left text-sm border rounded-md hover:bg-gray-50 ${
                      selectedOrder?.customerName === search
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                  >
                    Create new order for {search}
                  </button>
                )}
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!isFormValid()}
            onClick={() => {
              if (selectedOrder) {
                const existingProductIndex = selectedOrder.products?.findIndex(
                  (p) =>
                    p.id === product.sys.id &&
                    ("type" in p && p.type === "combo"
                      ? true
                      : p.size === selectedSize)
                );

                const currentPrice = getProductPrice();

                if (
                  existingProductIndex !== undefined &&
                  existingProductIndex >= 0
                ) {
                  // Update existing product quantity
                  const updatedProducts = [...(selectedOrder.products || [])];
                  updatedProducts[existingProductIndex].quantity += quantity;

                  const updatedOrder = {
                    ...selectedOrder,
                    products: updatedProducts,
                    totalCost:
                      (selectedOrder.totalCost || 0) +
                      quantity * currentPrice -
                      (selectedOrder.discount || 0),
                    discount: selectedOrder.discount || 0,
                  };

                  setOrderList(
                    orderList.map((o) =>
                      o.id === selectedOrder.id ? updatedOrder : o
                    )
                  );
                } else {
                  // Add new product to order
                  const updatedOrder = {
                    ...selectedOrder,
                    products: [
                      ...(selectedOrder.products || []),
                      {
                        id: product.sys.id,
                        name: product.fields.name,
                        type:
                          "type" in product.fields
                            ? product.fields.type
                            : "combo",
                        quantity: quantity,
                        price: currentPrice,
                        size: selectedSize || undefined,
                        comboChoose:
                          "anyCombo" in product.fields
                            ? comboSelections
                            : undefined,
                      },
                    ],
                    totalCost:
                      (selectedOrder.totalCost || 0) +
                      quantity * currentPrice -
                      (selectedOrder.discount || 0),
                    discount: selectedOrder.discount || 0,
                  };

                  setOrderList(
                    orderList.map((o) =>
                      o.id === selectedOrder.id ? updatedOrder : o
                    )
                  );
                }
              }
              setShowOrderModal(false);
              toast.success("Product added to orderlist");
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateOrderModal;
