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
    image?: Image;
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

export interface Order extends EntrySkeletonType {
  fields: {
    customerName: string;
    customerText: string;
    adminText: string;
    adminDeliver: boolean;
  };
  sys: {
    id: string;
  };
  contentTypeId: string;
}

export interface Image {
  sys: {
    space: {
      sys: {
        type: string;
        linkType: string;
        id: string;
      };
    };
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    environment: {
      sys: {
        id: string;
        type: string;
        linkType: string;
      };
    };
    publishedVersion: number;
    revision: number;
    locale: string;
  };
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      details: {
        size: number;
        image: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}
