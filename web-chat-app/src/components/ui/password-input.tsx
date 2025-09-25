import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "./input";
import { Button } from "./button";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

const PasswordInput = ({
  className,
  placeholder,
  register,
}: {
  className?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn<string>;
}) => {
  const [hide, setHide] = useState(true);

  return (
    <div className="relative w-full">
      <Input
        {...register}
        type={hide ? "password" : "text"}
        className={className}
        placeholder={placeholder}
      />
      <Button
        onClick={() => setHide(!hide)}
        type="button"
        className="absolute right-1 top-1/2 -translate-y-1/2 border-0 cursor-pointer hover:opacity-50"
        variant={"no_style"}
      >
        {hide ? <EyeClosed></EyeClosed> : <Eye></Eye>}
      </Button>
    </div>
  );
};

export default PasswordInput;
