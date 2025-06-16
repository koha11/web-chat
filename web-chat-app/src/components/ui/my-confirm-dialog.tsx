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

const MyConfirmDialog = ({
  isOpen,
  setOpen,
  content,
  title,
}: {
  title: string;
  content: string;
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
            <DialogDescription className="py-2">{content}</DialogDescription>
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

export default MyConfirmDialog;
