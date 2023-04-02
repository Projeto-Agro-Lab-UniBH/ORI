export function Diagnosis({ data }: any) {
  return (
    <div className="whitespace-nowrap overflow-hidden text-base font-normal text-white text-ellipsis max-w-[208px] px-2 py-[2px] bg-brand-standard-black rounded border-none">
      {data}
    </div>
  );
}
