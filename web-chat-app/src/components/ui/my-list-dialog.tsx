import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

const MyListDialog = ({}: {
  isOpen: boolean;
  setOpen: () => void;
  title: string;
}) => {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader className="border-b-2">
          <DialogTitle className="mb-4">{""}</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MyListDialog;
