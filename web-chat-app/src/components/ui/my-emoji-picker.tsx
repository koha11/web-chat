import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const MyEmojiPicker = ({
  open = true,
  style,
  onEmojiSelect,
  onClick,
  className,
  asChild,
}: {
  open?: boolean;
  style?: React.CSSProperties;
  onEmojiSelect: ({ native, unified }: any) => void;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  asChild?: boolean;
}) => {
  if (asChild) return <Picker data={data} onEmojiSelect={onEmojiSelect} />;

  return (
    <div hidden={!open} style={style} onClick={onClick} className={className}>
      <Picker data={data} onEmojiSelect={onEmojiSelect} />
    </div>
  );
};

export default MyEmojiPicker;
