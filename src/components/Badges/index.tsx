const Badges = ({ data }: any) => {
  return (
    <div className="whitespace-nowrap text-sm font-normal text-white text-ellipsis overflow-hidden max-w-[204px] border-none rounded px-2 py-[2px] bg-shark-950">
      {data}
    </div>
  );
}

export default Badges;