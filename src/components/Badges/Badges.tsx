export function Badges({ data }: any) {
  return (
    <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[204px] px-2 py-[2px] rounded text-sm font-normal text-white bg-brand-standard-black border-none">
      {data}
    </span>
  );
}
