import type { NextPage } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR from "swr";
import { ProductWithRecords } from "pages";
import ProductList from "@components/product-list";

interface ProductListResponse {
  [key: string]: ProductWithRecords[];
}

const Sold: NextPage = () => {
  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductList kind="sale" />
      </div>
    </Layout>
  );
};

export default Sold;
