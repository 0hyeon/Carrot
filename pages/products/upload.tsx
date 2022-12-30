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

  const [photoPreview, setPhotoPreview] = useState<any>([]);
  const [fileView, setfileView] = useState<any>([]);
  const onValid = async ({ name, price, description }: UploadProductForm) => {//submit
    
    if (loading) return;

    if (photo && photo.length > 0) {
      const form = new FormData();
      // setPhotoPreview
      
      
      for (let key of form.keys()) {//form 들어있는 값 확인
        console.log(key, ":", form.get(key));
      }
      
      let dummyId : string[] = [];
      for (let i = 0; i< photoPreview.length;i++){//업로드 갯수만큼 
        form.append("file", fileView[i]); //인자1 : from의 name , 인자2 : 보낼사진 , 인자 3 : 사진의 이름
        console.log("fileView[i] : ",fileView[i]);
        console.log("photo[0] : ",photo[0]);

        const { uploadURL } = await (await fetch("/api/files")).json(); // 백엔드api에서 CF에서 빈파일 url전해받음
        const {
          result: { id }, // db에 저장해아할 사진 id 
        } = await (await fetch(uploadURL, { method: "POST", body: form })).json();

        form.forEach(function(val, key, fD){
          // here you can add filtering conditions
          form.delete(key)
        });
        console.log("id : ",id);
        dummyId.push(id)
      }
      uploadProduct({ name, price, description, photoId: dummyId,productId:9999 });

    } else {

      uploadProduct({ name, price, description });

    }
  };
  

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
      setfileView([...fileView, photo[0] ]);

      // URL.revokeObjectURL(URL.createObjectURL(file));
      console.log("photo2 : ", photo);
      console.log("file2 : ", file);
      console.log("photoPreview2 : ", photoPreview);
      console.log("fileView2 : ", fileView);
    }
  }, [photo]);
  return (
    <Layout canGoBack title="중고거래 글쓰기">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)} encType="multipart/form-data">
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
        <Button text={loading ? "Loading..." : "상품 업로드"} />
      </form>
    </Layout>
  );
};

export default Upload;
