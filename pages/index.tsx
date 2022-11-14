import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser, { ProfileResponse } from "@libs/client/useUser";
import Head from "next/head";
import useSWR, { SWRConfig } from "swr";
import { Product, Record } from "@prisma/client";
import client from "@libs/server/client";
export interface ProductWithRecords extends Product {
  records: Record;
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithRecords[];
}
const Home: NextPage = () => {
  const { data } = useSWR<ProductsResponse>("/api/products");
  const { data: data3, error: error3 } =
    useSWR<ProfileResponse>("/api/users/me");
  return (
    <Layout title="홈" hasTabBar seoTitle="Home">
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products?.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            image={product.image}
            comments={99}
            // hearts={product._count.favs}
            hearts={Object.keys(product.records).length}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

const Page: NextPage<{ products: ProductWithRecords[] }> = ({ products }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          //캐시초기값설정
          "/api/products": {
            ok: true,
            products,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};
export async function getServerSideProps() {
  console.log("SSR");
  const products = await client.product.findMany({
    include: { records: { where: { kind: "Fav" } } },
  });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}

export default Page;
