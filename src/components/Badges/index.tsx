const Badges = ({ data }: any) => {
  return (
    <div className="max-w-[204px] px-2 py-[2px] whitespace-nowrap text-ellipsis text-sm font-normal text-neutral-50 overflow-hidden border-none rounded bg-slate-800">
      {data}
    </div>
  );
}

export default Badges;