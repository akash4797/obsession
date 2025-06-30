import client from "@/lib/contentful";
import SearchAndFilter from "@/components/SearchAndFilter";
import { Product, Combo } from "@/lib/Skeleton";
import Products from "@/components/Products";

export const revalidate = 0;

export default async function Home() {
  const productEntries = await client.getEntries<Product>({
    content_type: "product",
    limit: 300,
  });

  console.log(productEntries.items[0].fields.image);

  const comboEntries = await client.getEntries<Combo>({
    content_type: "combo",
    limit: 300,
  });

  const combos = comboEntries.items.map((item) => ({
    sys: item.sys,
    fields: {
      name: item.fields.name,
      price: item.fields.price,
      products: item.fields.products as Product[],
      desc: item.fields.desc,
      anyCombo: item.fields.anyCombo,
    },
    contentTypeId: item.sys.contentType.sys.id,
  }));

  const products = productEntries.items.map((item) => ({
    sys: item.sys,
    fields: {
      name: item.fields.name,
      type: item.fields.type,
      price10ml: item.fields.price10ml,
      price30ml: item.fields.price30ml,
      price120ml: item.fields.price120ml,
      gender: item.fields.gender,
      classification: item.fields.classification,
      topNote: item.fields.topNote,
      strength: item.fields.strength,
      image: item.fields.image,
    },
    contentTypeId: item.sys.contentType.sys.id,
  }));

  return (
    <div className="container mx-auto px-5 sm:px-0">
      <div className="py-5">
        <SearchAndFilter />
      </div>
      <div className="">
        <Products products={products} combo={combos as unknown as Combo[]} />
      </div>
    </div>
  );
}
