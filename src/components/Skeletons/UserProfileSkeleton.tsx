import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UserProfileSkeleton = () => {
  return (
    <div className="w-[300px] flex items-center gap-2">
      <div className="w-12 h-14 flex items-center justify-">
        <div className="w-10 h-10 flex items-center justify-center">
          <Skeleton circle width={40} height={40} />
        </div>
      </div>
      <div className="w-[244px] h-14 flex justify-center items-center flex-col">
        <div className="w-[244px] flex">
          <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[18px] font-semibold text-brand-standard-black">
          <Skeleton width={244} />
          </p>
        </div>
        <div className="w-[244px] flex">
          <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[14px] font-light text-brand-standard-black">
            <Skeleton width={204} />
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserProfileSkeleton