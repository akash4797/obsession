"use client";
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Product, Combo } from "@/lib/Skeleton";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import CreateOrderModal from "./CreateOrderModal";
// import ShowProductImage from "./ShowProductImage";

const SingleProduct = ({
  showDrawer,
  setShowDrawer,
  product,
}: {
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  product: Product | Combo | null;
}) => {
  const [showOrderModal, setShowOrderModal] = React.useState(false);
  const [showCopyArea, setShowCopyArea] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  if (!product) return null;

  const handleCopy = (text: string) => {
    setShowCopyArea(true);
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.value = text;
        textAreaRef.current.select();
        textAreaRef.current.setSelectionRange(0, text.length);
        try {
          document.execCommand("copy");
          toast.success("Copied to clipboard!");
        } catch (err) {
          console.error("Copy failed:", err);
          toast.error("Failed to copy text");
        }
        setShowCopyArea(false);
      }
    }, 100);
  };

  return (
    <>
      <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center">
              <span>
                {product.fields.name}
                {"type" in product.fields && `- ${product.fields.type}`}
              </span>
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={(e) => {
                  e.stopPropagation();
                  const text = [
                    `${"desc" in product.fields ? "Combo Name: " : ""}${
                      product.fields.name
                    } ${
                      "type" in product.fields ? `- ${product.fields.type}` : ""
                    }`,
                    "desc" in product.fields &&
                      `Description: \n${product.fields.desc}`,
                    "gender" in product.fields &&
                      `Gender: ${product.fields.gender}`,
                    "classification" in product.fields &&
                      `Classification: ${product.fields.classification}`,
                    "topNote" in product.fields &&
                      `Top Note: ${product.fields.topNote}`,
                    "strength" in product.fields &&
                      `Strength: ${product.fields.strength}`,
                    "price10ml" in product.fields &&
                      `10ml: ${product.fields.price10ml} Taka`,
                    "price30ml" in product.fields &&
                      `30ml: ${product.fields.price30ml} Taka`,
                    "price120ml" in product.fields &&
                      `120ml: ${product.fields.price120ml} Taka`,
                    "price" in product.fields &&
                      `Price: ${product.fields.price}`,
                  ]
                    .filter(Boolean)
                    .join("\n");

                  handleCopy(text);
                }}
              >
                <Copy />
              </Button>
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 flex flex-col gap-3">
            {/* {"image" in product.fields && product.fields.image?.fields.file.url && (
              <div className="mb-4 h-[200px]">
                <ShowProductImage imageUrl={`https:${product.fields.image.fields.file.url}`} />
              </div>
            )} */}
            <div className="text-sm grid grid-cols-2 gap-2">
              <div className="">
                <span className="font-semibold">Price:</span>
                {"price10ml" in product.fields && (
                  <div>10ml: {product.fields.price10ml} Taka</div>
                )}
                {"price30ml" in product.fields && (
                  <div>30ml: {product.fields.price30ml} Taka</div>
                )}
                {"price120ml" in product.fields && (
                  <div>120ml: {product.fields.price120ml} Taka</div>
                )}
                {"price" in product.fields && (
                  <div>{product.fields.price} Taka</div>
                )}
              </div>
              {"gender" in product.fields && (
                <div className="">
                  <span className="font-semibold">Gender:</span>
                  <div>{product.fields.gender}</div>
                </div>
              )}
              {"classification" in product.fields && (
                <div className="">
                  <span className="font-semibold">Classification:</span>
                  <div>{product.fields.classification}</div>
                </div>
              )}
              {"strength" in product.fields && (
                <div className="">
                  <span className="font-semibold">Strength:</span>
                  <div>{product.fields.strength}</div>
                </div>
              )}
              {"topNote" in product.fields && (
                <div className="">
                  <span className="font-semibold">Top Note:</span>
                  <div>{product.fields.topNote}</div>
                </div>
              )}
            </div>
            <div className="text-sm">
              {"desc" in product.fields && (
                <div className="flex flex-col gap-2">
                  <span className="font-semibold">Description:</span>
                  <textarea
                    className="p-3 border border-gray-300 rounded-lg"
                    defaultValue={product.fields.desc}
                    rows={4}
                    readOnly
                  />
                </div>
              )}
            </div>
          </div>
          <DrawerFooter className="grid grid-cols-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button onClick={() => setShowOrderModal(true)}>
              Create Order
            </Button>
          </DrawerFooter>
          {showCopyArea && (
            <textarea
              ref={textAreaRef}
              className="fixed top-0 left-0 opacity-0 pointer-events-none"
              style={{ width: "1px", height: "1px" }}
            />
          )}
        </DrawerContent>
      </Drawer>
      <CreateOrderModal
        showOrderModal={showOrderModal}
        setShowOrderModal={setShowOrderModal}
        product={product}
      />
    </>
  );
};

export default SingleProduct;
