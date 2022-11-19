import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { useEffect, useRef } from "react";
import streams from "pages/api/streams";

interface StreamMessage {
  message: string;
  id: number;
  user: {
    avatar?: string;
    id: number;
  };
}

interface StreamWithMessages extends Stream {
  messages: StreamMessage[];
}

interface StreamResponse {
  ok: boolean;
  stream: StreamWithMessages;
}

interface MessageForm {
  message: string;
}
const Streams: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { data, mutate } = useSWR<StreamResponse>( //GET
    typeof window === undefined
      ? null
      : router.query.id
      ? `/api/streams/${router.query.id}`
      : null,
    {
      refreshInterval: 1000, //useSWR의 옵션 1초마다 새로갱신 데이터불러옴
    }
  );
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      //가짜데이터 -> 사용자경험 측면에서 좋다.
      //data refetch
      //mutate는 캐시에 가짜데이터를 넣어 ui를 즉각적으로 만들지만,
      //그즉시 백엔드에게 이중확인을 받게됨
      (prev) =>
        prev &&
        ({
          //첫번째 인수는 캐시의 모든 이전 데이터,
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              {
                id: Date.now(),
                message: form.message,
                user: {
                  ...user,
                },
              },
            ],
          },
        } as any),
      false // 두번째 인수는 백엔드에서 재확인을 할지말지
    );
    sendMessages(form); //실제 백엔드에 메시지 보내는 함수
  };
  const [sendMessages, { loading, data: sendMessageData }] = useMutation(
    //POST
    `/api/streams/${router.query.id}/messages`
  );

  useEffect(() => {
    if (data?.ok === false) {
      router.push("/streams");
    }
  }, [data, router]);
  // 채팅창의 스크롤을 맨 밑으로 유지하는 법
  useEffect(() => {
    scrollRef?.current?.scrollIntoView();
  });
  return (
    <Layout canGoBack>
      <div className="py-10 px-4  space-y-4">
        {data?.stream.cloudflareId ? (
          <iframe
            className="w-full aspect-video  rounded-md shadow-sm"
            src={`https://iframe.videodelivery.net/${data?.stream.cloudflareId}`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
          ></iframe>
        ) : null}
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            {data?.stream?.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
          <div className="bg-orange-400 p-5 rounded-md overflow-scroll flex flex-col space-y-3">
            <span>Stream Keys (secret)</span>
            <span className="text-white">
              <span className="font-medium text-gray-800">URL:</span>{" "}
              {data?.stream.cloudflareUrl}
            </span>
            <span className="text-white">
              <span className="font-medium text-gray-800">Key:</span>{" "}
              {data?.stream.cloudflareKey}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {/* <Message message="Hi how much are you selling them for?" />
            <Message message="I want ￦20,000" reversed />
            <Message message="미쳤어" /> */}
            {data?.stream?.messages.map((message) => (
              <>
                <Message
                  key={message.id}
                  message={message.message}
                  reversed={message.user.id === user?.id}
                />
                <div ref={scrollRef} />
              </>
            ))}
          </div>
          <div className="fixed py-2 bg-white bottom-0 inset-x-0">
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex relative max-w-md items-center  w-full mx-auto"
            >
              <input
                {...register("message", { required: true })}
                type="text"
                className="shadow-sm rounded-full w-full py-2 px-4 border-2 border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Streams;
