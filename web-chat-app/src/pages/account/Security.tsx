import {
  useChangeEmail,
  useGetAccount,
  useVerifyEmail,
} from "@/hooks/auth.hook";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/loading";
import { useForm } from "react-hook-form";
import { emailFieldSchema, EmailSchemaType } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

const Security = () => {
  const userId = Cookies.get("userId")!;
  const navigate = useNavigate();

  const { data: account, loading } = useGetAccount({ userId });

  const [verifyEmail] = useVerifyEmail();
  const [changeEmail] = useChangeEmail(userId);

  const {
    register,
    setValue,
    formState: { errors },
    setError,
    handleSubmit,
    reset,
  } = useForm<EmailSchemaType>({
    resolver: zodResolver(emailFieldSchema),
  });

  const [isEmailEdited, setEmailEdited] = useState(false);
  const [isSentVerifyMail, setSentVerifyMail] = useState(false);

  useEffect(() => {
    if (account) setValue("email", account.email ?? "");
  }, [account]);

  const handleChangeEmail = async ({ email }: EmailSchemaType) => {
    setEmailEdited(false);
    if (account?.email == email) return;
    changeEmail({
      variables: { email },
      onCompleted(data, clientOptions) {
        setSentVerifyMail(true);
      },
      onError({ message }, clientOptions) {
        setError("email", { message });
      },
    });
  };

  if (loading) return <Loading></Loading>;

  return (
    <>
      <div className="">
        <h3 className="font-bold">EMAIL</h3>
        <form
          className="flex gap-4 py-2"
          onSubmit={handleSubmit(handleChangeEmail)}
        >
          <Input
            placeholder="Email"
            className={`w-1/2 ${errors.email && "border-red-700"}`}
            readOnly={!isEmailEdited}
            {...register("email")}
          ></Input>
          {isEmailEdited ? (
            <>
              <Button className="cursor-pointer bg-green-800" type="submit">
                <Check></Check>
              </Button>
              <Button
                className="cursor-pointer bg-red-600"
                onClick={() => {
                  setEmailEdited(!isEmailEdited);
                  reset({ email: account?.email });
                }}
              >
                <X></X>
              </Button>
            </>
          ) : (
            <Button
              className="cursor-pointer"
              onClick={() => {
                setEmailEdited(!isEmailEdited);
              }}
            >
              <Edit></Edit>
            </Button>
          )}
        </form>
        <div className="py-2 relative w-full">
          <div className="text-sm absolute text-nowrap left-2 -top-1 text-red-600">
            {errors.email && errors.email.message}
          </div>
        </div>
        {!account?.email ? (
          <div>
            Your Email is empty, verify it to get password when you forget it
          </div>
        ) : !account?.isConfirmedEmail ? (
          <div>
            {isSentVerifyMail
              ? "We have sent to your mail box to verify "
              : "Your email is not verify"}
            ,{" "}
            <span
              onClick={async () => {
                await verifyEmail({
                  variables: { email: account.email },
                });
              }}
              className="cursor-pointer text-blue-600 underline"
            >
              Click here to verify
            </span>
          </div>
        ) : (
          <div>You have verified email</div>
        )}
      </div>
    </>
  );
};

export default Security;
