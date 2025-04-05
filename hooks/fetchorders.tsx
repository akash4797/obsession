import { Order } from "@/lib/Skeleton";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR("/api/fetchorders", fetcher);

  return {
    orders: data?.orders as Order[],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}