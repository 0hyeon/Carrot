import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import { useEffect } from "react";
import Image from "next/image";
import { numberWithCommas } from "@libs/client/useComma";
import client from "@libs/server/client";
interface ProductWithUser extends Product {
  user: User;
}
interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({
  product,
  relatedProducts,
  isLiked,
}) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFavClick = () => {
    if (!data) return;
    boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    // mutate({ ...data, product: { ...data?.product, name: "photato" } }, false);
    // mutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false);
    //첫째인자 key값, 둘째 변경할값 ,셋쩨 revalidation
    //unbound mutate의 경우 컴포넌트내에 데이트가 없어서 캐시안에 있는 데이터가 필요할때가 있다.

    toggleFav({});
  };
  const alertReady = () => {
    alert("준비중입니다.");
  };
  useEffect(() => {});
  return (
    <Layout canGoBack seoTitle="Product">
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="relative pb-80">
            <Image
              src={`https://imagedelivery.net/tUnns8TnvEqxOzjreCbU6w/${product?.image}/public`}
              className="h-96 bg-slate-300 object-cover rounded-md"
              layout="fill"
            />
          </div>
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            <Image
              width={48}
              height={48}
              src={`https://imagedelivery.net/tUnns8TnvEqxOzjreCbU6w/${product?.user?.avatar}/avatar`}
              className="w-12 h-12 rounded-full bg-slate-300"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {product?.user?.name}
              </p>
              <Link href={`/users/profiles/${product?.user?.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <span className="text-2xl block mt-3 text-gray-900">
              {data ? numberWithCommas(product?.price) + "원" : null}
            </span>
            <p className=" my-6 text-gray-700">{product?.description}</p>
            <div
              className="flex items-center justify-between space-x-2"
              onClick={alertReady}
            >
              <Button large text="1:1 채팅하기" />
              <button
                onClick={onFavClick}
                className={cls(
                  "p-3 rounded-md flex items-center hover:bg-gray-100 justify-center ",
                  isLiked
                    ? "text-red-500  hover:text-red-600"
                    : "text-gray-400  hover:text-gray-500"
                )}
              >
                {isLiked ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            이 글과 함께 봤어요
          </h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {relatedProducts?.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <a>
                  <div className="h-56 w-full mb-4 bg-slate-300 relative">
                    <Image
                      src={`https://imagedelivery.net/tUnns8TnvEqxOzjreCbU6w/${product.image}/public`}
                      className="h-96 bg-slate-300 object-cover rounded-md"
                      layout="fill"
                    />
                  </div>
                  <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    {numberWithCommas(product.price)}원
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }
  const product = await client.product.findUnique({
    where: {
      id: +ctx.params.id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isLiked = false;
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isLiked,
    },
  };
};

export default ItemDetail;
