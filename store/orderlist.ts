import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Define the type for a single order item
export interface OrderItem {
  id: number;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  products?: {
    id: string;
    name: string;
    type: string;
    quantity: number;
    price: number;
    size?: string;
    comboChoose?: {
      id: string;
      name: string;
      price: number;
    }[];
  }[];
  deliveryCharge?: number;
  totalCost?: number;
  discount?: number;
  note?: string;
  adminDeliver: boolean;
}

// Define the type for the order list
type OrderList = OrderItem[];

// Create an atom with localStorage persistence
export const orderListAtom = atomWithStorage<OrderList>("orderList", []);

// Create a derived atom for order-related computations if needed
export const orderCountAtom = atom((get) => get(orderListAtom).length);
