export function Badges({ data }: any) {
  return (
    <span className="bg-shark-950 px-2 py-[2px] text-sm font-normal text-white text-ellipsis whitespace-nowrap overflow-hidden max-w-[204px] border-none rounded">
      {data}
    </span>
  );
}
