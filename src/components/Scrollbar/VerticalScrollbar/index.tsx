import * as ScrollArea from "@radix-ui/react-scroll-area";

const VerticalScrollbar = ({
  children,
  styleViewportArea,
}: {
  styleViewportArea: string;
  children: React.ReactNode;
}) => {
  return (
    <ScrollArea.Root>
      <ScrollArea.Viewport className={styleViewportArea}>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="w-1" orientation="vertical">
        <ScrollArea.Thumb className="bg-[#9ca3af] hover:bg-[#4b5563]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};

export default VerticalScrollbar;
