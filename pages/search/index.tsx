import Item from '@components/item';
import Layout from '@components/layout'
import useMutation from '@libs/client/useMutation';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
export default function searchPage() {
  const router = useRouter();
  const [isSearch, setSearch] = useState([]);
  useEffect(() => {
    if (!router.isReady) return;
    // console.log(router.query);
    setSearch(JSON.parse(router.query.data as string));
    console.log(JSON.parse(router.query.data as string));
  }, [router,setSearch]);

  return (
    <Layout canGoBack seoTitle="search">
      <div className="text-center">
        <div className="hidden md:block mb-20 text-3xl font-normal">검색 결과</div>
      </div>
      <div className="md:w-full flex flex-row md:space-y-0 space-y-5 divide-y md:divide-y-0 flex-wrap">
        {isSearch?.map((record : any) => (
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
      </div>
    </Layout>
  )
}
