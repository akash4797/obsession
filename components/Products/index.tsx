"use client";
import React, { useEffect, useState } from "react";
import { Product, Combo } from "@/lib/Skeleton";
import { useAtomValue } from "jotai";
import { searchAtom } from "@/store/search";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import SingleProduct from "./SingleProduct";

const Products = ({
  products,
  combo,
}: {
  products: Product[];
  combo: Combo[];
}) => {
  const search = useAtomValue(searchAtom);
  const [filteredPerfumes, setFilteredPerfumes] = useState<Product[]>([]);
  const [filteredMists, setFilteredMists] = useState<Product[]>([]);
  const [filteredCombos, setFilteredCombos] = useState<Combo[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    Product | Combo | null
  >(null);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for iOS
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      toast.success("Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy");
    }
  };

  useEffect(() => {
    // Filter products based on search term
    const searchLower = search.toLowerCase();

    const perfumes = products.filter(
      (product) =>
        product.fields.type === "Perfume" &&
        (product.fields.name.toLowerCase().includes(searchLower) ||
          product.fields.classification?.toLowerCase().includes(searchLower) ||
          product.fields.topNote?.toLowerCase().includes(searchLower) ||
          product.fields.price10ml?.toString().includes(searchLower))
    );

    const mists = products.filter(
      (product) =>
        product.fields.type === "Mist" &&
        (product.fields.name.toLowerCase().includes(searchLower) ||
          product.fields.classification?.toLowerCase().includes(searchLower) ||
          product.fields.topNote?.toLowerCase().includes(searchLower) ||
          product.fields.price120ml?.toString().includes(searchLower))
    );

    const combos = combo.filter(
      (comboItem) =>
        comboItem.fields.name.toLowerCase().includes(searchLower) ||
        comboItem.fields.price?.toString().includes(searchLower)
    );

    setFilteredPerfumes(perfumes);
    setFilteredMists(mists);
    setFilteredCombos(combos);
  }, [search, products, combo]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Perfume Section */}
      {filteredPerfumes.length > 0 && (
        <section className="w-full">
          <h2 className="font-semibold mb-4">Perfumes</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {filteredPerfumes.map((perfume) => (
              <div
                key={perfume.sys.id}
                className="min-w-[200px] p-4 border rounded-lg shadow space-y-1"
                onClick={() => {
                  setSelectedProduct(perfume);
                  setShowDrawer(true);
                }}
              >
                <h3 className="font-medium">{perfume.fields.name}</h3>
                {perfume.fields.price10ml && (
                  <div className="flex items-center">
                    <p className="text-gray-600 text-xs">
                      BDT{perfume.fields?.price10ml} - 10ml
                    </p>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(
                          `${perfume.fields.name} 10ml - ${perfume.fields?.price10ml} Taka`
                        );
                      }}
                    >
                      <Copy />
                    </Button>
                  </div>
                )}
                {perfume.fields.price30ml && (
                  <div className="flex items-center">
                    <p className="text-gray-600 text-xs">
                      BDT{perfume.fields?.price30ml} - 30ml
                    </p>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(
                          `${perfume.fields.name} 30ml - ${perfume.fields?.price30ml} Taka`
                        );
                      }}
                    >
                      <Copy />
                    </Button>
                  </div>
                )}
                {perfume.fields.price120ml && (
                  <div className="flex items-center">
                    <p className="text-gray-600 text-sm">
                      BDT{perfume.fields?.price120ml} - 120ml
                    </p>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(
                          `${perfume.fields.name} 120ml - ${perfume.fields?.price120ml} Taka`
                        );
                      }}
                    >
                      <Copy />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mist Section */}
      {filteredMists.length > 0 && (
        <section className="w-full">
          <h2 className="font-semibold mb-4">Mists</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {filteredMists.map((mist) => (
              <div
                key={mist.sys.id}
                className="min-w-[200px] p-4 border rounded-lg shadow space-y-1"
                onClick={() => {
                  setSelectedProduct(mist);
                  setShowDrawer(true);
                }}
              >
                <h3 className="font-medium">{mist.fields.name}</h3>
                {mist.fields.price10ml && (
                  <div className="flex items-center">
                    <p className="text-gray-600 text-xs">
                      BDT{mist.fields?.price10ml} - 10ml
                    </p>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(
                          `${mist.fields.name} 10ml - ${mist.fields?.price10ml} Taka`
                        );
                      }}
                    >
                      <Copy />
                    </Button>
                  </div>
                )}
                {mist.fields.price30ml && (
                  <div className="flex items-center">
                    <p className="text-gray-600 text-xs">
                      BDT{mist.fields?.price30ml} - 30ml
                    </p>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(
                          `${mist.fields.name} 30ml - ${mist.fields?.price30ml} Taka`
                        );
                      }}
                    >
                      <Copy />
                    </Button>
                  </div>
                )}
                {mist.fields.price120ml && (
                  <div className="flex items-center">
                    <p className="text-gray-600 text-xs">
                      BDT{mist.fields?.price120ml} - 120ml
                    </p>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(
                          `${mist.fields.name} 120ml - ${mist.fields?.price120ml} Taka`
                        );
                      }}
                    >
                      <Copy />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Combo Section */}
      {filteredCombos.length > 0 && (
        <section className="w-full">
          <h2 className="font-semibold mb-4">Combos</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {filteredCombos.map((comboItem) => (
              <div
                key={comboItem.sys.id}
                className="min-w-[200px] p-4 border rounded-lg shadow"
                onClick={() => {
                  setSelectedProduct(comboItem);
                  setShowDrawer(true);
                }}
              >
                <h3 className="font-medium">{comboItem.fields.name}</h3>
                <div className="flex items-center">
                  <p className="text-gray-600 text-xs">
                    BDT{comboItem.fields.price}
                  </p>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(
                        `${comboItem.fields.name} - ${comboItem.fields?.price} Taka`
                      );
                    }}
                  >
                    <Copy />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <SingleProduct
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        product={selectedProduct as Product}
      />
    </div>
  );
};

export default Products;
