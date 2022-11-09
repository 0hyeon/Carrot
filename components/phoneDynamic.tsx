import useMutation from "@libs/client/useMutation";
import { MutationResult } from "pages/enter";
import { useForm } from "react-hook-form";
import Button from "./button";
import Input from "./input";

export function PhoneCompnents() {
  const { register } = useForm();
  return (
    <>
      <Input
        register={register("phone")}
        name="phone"
        label="Phone number"
        type="number"
        kind="phone"
        required
      />
    </>
  );
}

export function PhoneCompBtn() {
  const [enter, { loading, data, error }] =
    useMutation<MutationResult>("/api/users/enter");
  return (
    <>
      <Button text={loading ? "Loading" : "Get one-time password"} />
    </>
  );
}
