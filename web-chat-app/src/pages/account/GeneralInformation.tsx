import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUploadUserAvatar } from "@/hooks/user.hook";
import { IUser } from "@/interfaces/user.interface";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "react-router-dom";

const GeneralInformation = () => {
  const { register } = useForm<IUser>();
  const [uploadUserAvatar] = useUploadUserAvatar();

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl relative">
        <img
          src={`assets/images/google-logo.png`}
          alt="User Avatar"
          className="w-full h-full object-cover"
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

            console.log(file);

            const result = await uploadUserAvatar({ variables: { file } });
            console.log("Uploaded URL:", result.data.uploadUserAvatar);
          }}
        ></Input>
      </div>
      <Form>
        <div className="flex items-center gap-8">
          <Label>Fullname</Label>
          <Input {...register("fullname")}></Input>
        </div>
      </Form>
    </div>
  );
};

export default GeneralInformation;
