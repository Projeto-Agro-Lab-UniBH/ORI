import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Component = () => {
  return (
    <div className="w-full h-[104px] px-4 pt-2 pb-2 flex items-center bg-white border border-gray-200 rounded-lg">
      <div className="w-full">
        <div className="h-20 flex items-center p-2 gap-[24px]">
          <div className="w-[344px] flex gap-4">
            <div className="w-[88px] h-[80px] flex items-center flex-col justify-between">
              <div className="w-[88px] mt-[7.5px] flex justify-start">
                <Skeleton width={23.23} height={28} />
              </div>
              <div className=" mb-[7.5px]">
                <Skeleton width={88} height={24} />
              </div>
            </div>
            <div className="w-[238.6px] h-full flex items-center">
              <div className="w-full flex items-center gap-4">
                <div className="w-16 h-16 flex items-center">
                  <Skeleton circle width={64} height={64} />
                </div>
                <div className="w-[158.6px] h-[80px] justify-between flex flex-col">
                  <div className="w-[158.6px] mt-[8.4px]">
                    <Skeleton width={104} height={24} />
                  </div>
                  <div className="w-[158.6px] mb-[7.5px]">
                    <Skeleton width={158.6} height={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-10">
            <div className="w-[256px] flex items-center flex-col">
              <div className="w-full">
                <Skeleton width={167.74} height={24} className="mb-2" />
              </div>
              <div className="w-full flex items-center flex-row gap-2">
                <Skeleton width={61} height={24} />
                <Skeleton width={104} height={24} />
                <Skeleton width={54} height={24} />
              </div>
            </div>
            <div className="w-[124px] flex items-center flex-col">
              <div className="w-full">
                <Skeleton width={110.41} height={24} className="mb-2" />
              </div>
              <div className="w-full flex items-center">
                <Skeleton width={110.41} height={24} />
              </div>
            </div>
            <div className="w-full flex items-center flex-col">
              <div className="w-full">
                <Skeleton width={264.93} height={24} className="mb-2" />
              </div>
              <div className="w-full flex items-center flex-row gap-2">
                <Skeleton width={66.23} height={24} />
                <Skeleton width={66.23} height={24} />
                <Skeleton width={66.23} height={24} />
                <Skeleton width={66.23} height={24} />
              </div>
            </div>
            <div className="w-full flex items-center flex-col">
              <div className="w-full">
                <Skeleton width={73.31} height={24} className="mb-2" />
              </div>
              <div className="w-full flex items-center flex-row gap-2">
                <Skeleton width={96.75} height={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataPatientCardsSkeleton = () => {
  return (
    <>
      <Component />
      <Component />
      <Component />
      <Component />
      <Component />
      <Component />
      <Component />
      <Component />
      <Component />
      <Component />
      <Component />
      <Component />
      <Component />
    </>
  )
}

export default DataPatientCardsSkeleton;
