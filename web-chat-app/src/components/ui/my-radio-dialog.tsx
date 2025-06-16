import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const MyRadioDialog = ({
  isOpen,
  setOpen,
  options,
  title,
  onSubmit,
}: {
  title: string;
  options: { title: string; des: string; value: any }[];
  onSubmit: Function;
  isOpen: boolean;
  setOpen: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <form>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="py-4">
              <RadioGroup defaultValue="comfortable">
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
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default MyRadioDialog;
