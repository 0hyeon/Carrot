import { ProductWithRecords } from "pages";
import useSWR from "swr";
import Item from "./item";

interface ProductListProps {
  kind: "fav" | "sale" | "purchase";
}

interface ProductListResponse {
  [key: string]: ProductWithRecords[];
}
export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<ProductListResponse>(
    typeof window === undefined ? null : `/api/users/me/records?kind=${kind}`
  );

  return data ? (
    <>
      {data[kind]?.map((record) => (
        <Item
          id={record.id}
          key={record.id}
          title={record.name}
          price={record.price}
          image={record.image}
          comments={0}
          hearts={Object.keys(record.records).length}
        />
      ))}
    </>
  ) : null;
}
