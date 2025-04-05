import { EntrySkeletonType } from "contentful";

export interface Product extends EntrySkeletonType {
  fields: {
    name: string;
    type: string;
    price10ml?: number;
    price30ml?: number;
    price120ml?: number;
    gender: string;
    classification?: string;
    topNote?: string;
    strength?: string;
  };
  contentTypeId: string;
  sys: {
    id: string;
  };
}

export interface Combo extends EntrySkeletonType {
  fields: {
    name: string;
    price: number;
    products: Product[];
    desc: string;
    anyCombo: boolean;
  };
  sys: {
    id: string;
  };
  contentTypeId: string;
}
