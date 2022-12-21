import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import products from "pages/api/products";
import Image from "next/image";
import axios from "axios";

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  photo: FileList;
}
interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  
  const [uploadProduct, { loading, data }] =
    useMutation<UploadProductMutation>("/api/products");

  const onValid = async ({ name, price, description }: UploadProductForm) => {
    if (loading) return;

    if (photo && photo.length > 0) {

      const form = new FormData();
      const config = {
        header: { 'content-type' : 'multipart/form-data' }
    }
      // setPhotoPreview
      form.append("file", photo[0], name); //인자1 : from의 name , 인자2 : 보낼사진 , 인자 3 : 사진의 이름
      let dummyId : string[] = [];
      for (let i = 0; i< photoPreview.length;i++){

        const { uploadURL } = await (await fetch("/api/files")).json(); // 백엔드api에서 CF에서 빈파일 url전해받음

        const {
          result: { id }, // db에 저장해아할 사진 id 
        } = await (await fetch(uploadURL, { method: "POST", body: form })).json();

        dummyId.push(id)
      }
      console.log("dummyId : ",dummyId)
      uploadProduct({ name, price, description, photoId: dummyId,productId:9999 });

    } else {

      uploadProduct({ name, price, description });

    }
  };
  const [photoPreview, setPhotoPreview] = useState<any>([]);

  const deleteHandler = (image: any) => {
    const currentIndex = photoPreview.indexOf(image);
    let newImages = [...photoPreview];

    newImages.splice(currentIndex, 1); //currentIndex 부터 한개만 지운다 즉 본인만
    setPhotoPreview(newImages);
    // props.refreshFunction(newImages);
  };
  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);
  const photo = watch("photo");
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview([...photoPreview, URL.createObjectURL(file)]);
      // URL.revokeObjectURL(URL.createObjectURL(file));
      console.log("photo : ", photo);
      console.log("file : ", file);
      console.log("photoPreview : ", photoPreview);
    }
  }, [photo]);
  return (
    <Layout canGoBack title="중고거래 글쓰기">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div className="flex">
          <label className="mr-3 w-20 h-20 cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              {...register("photo")}
              accept="image/*"
              className="hidden"
              type="file"
            />
          </label>
          {photoPreview ? (
            <div className="flex w-30">
              {photoPreview.map((src: string, index: string) => (
                <span className="mr-3 relative" key={index}>
                  <span
                    className="cursor-pointer absolute z-10 right-[-5px] top-[-10px] bg-black text-white rounded-full w-5 h-5 flex justify-center items-center text-sm"
                    onClick={() => deleteHandler(src)}
                    key={index}
                  >
                    X
                  </span>
                  <Image
                    src={src}
                    className=" text-gray-600 h-46 rounded-md bg-slate-300 object-cover"
                    width={80}
                    height={80}
                  />
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true })}
          required
          label="Price"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
          required
        />
        <Button text={loading ? "Loading..." : "Upload item"} />
      </form>
    </Layout>
  );
};

export default Upload;
