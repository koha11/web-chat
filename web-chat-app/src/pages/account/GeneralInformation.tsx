import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetUser, useUploadUserAvatar } from "@/hooks/user.hook";
import { IUser } from "@/interfaces/user.interface";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import Cookies from "js-cookie";
import Loading from "@/components/ui/loading";
import { useRef } from "react";

const GeneralInformation = () => {
  const userId = Cookies.get("userId")!;
  const avatarRef = useRef<HTMLImageElement>(null);
  const { register } = useForm<IUser>();
  const [uploadUserAvatar] = useUploadUserAvatar();
  const { data: userData, loading } = useGetUser({ userId });

  if (loading) return <Loading></Loading>;

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl relative">
        <img
          src={userData?.avatar}
          alt="User Avatar"
          className="w-full h-full object-cover"
          ref={avatarRef}
        />
        <Label
          htmlFor="user_avatar"
          className="absolute w-full h-1/3 bg-[rgba(0,0,0,0.1)] bottom-0 flex items-center justify-center hover:bg-[rgba(0,0,0,0.3)] cursor-pointer"
        >
          <Camera color="white"></Camera>
        </Label>
        <Input
          hidden
          type="file"
          accept="image/*"
          id="user_avatar"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const result = await uploadUserAvatar({ variables: { file } });
            avatarRef.current!.src = result.data.uploadUserAvatar;
          }}
        ></Input>
      </div>
      {/* <Form>
        <div className="flex items-center gap-8">
          <Label>Fullname</Label>
          <Input {...register("fullname")}></Input>
        </div>
      </Form> */}
    </div>
  );
};

export default GeneralInformation;
