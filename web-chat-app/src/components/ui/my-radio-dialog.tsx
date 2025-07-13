import { Controller, useForm } from "react-hook-form";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const MyRadioDialog = ({
  isOpen,
  setOpen,
  options,
  title,
  onSubmit,
  name,
  initValue,
}: {
  title: string;
  options: { title: string; des: string; value: any }[];
  onSubmit: (name: any) => void;
  isOpen: boolean;
  setOpen: () => void;
  name: string;
  initValue: any;
}) => {
  const { handleSubmit, control } = useForm<Record<string, any>>({
    defaultValues: {
      [name]: initValue,
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="mb-4">{title}</DialogTitle>
          </DialogHeader>

          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                {options.map((option) => (
                  <div className="flex items-start gap-4">
                    <RadioGroupItem
                      value={option.value}
                      id={"radio-" + option.value}
                      className="h-6 w-6"
                    />
                    <div>
                      <Label
                        htmlFor={"radio-" + option.value}
                        className="font-bold mb-2 text-[1rem]"
                      >
                        {option.title}
                      </Label>
                      <div>{option.des}</div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
          ></Controller>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MyRadioDialog;
