import { api } from "../../providers/Api";
import DataPatientCard from "../Cards/DataPatientCard";
import DataPatientCardsSkeleton from "../Skeletons/DataPatientCardSkeleton";
import { useQuery } from "react-query";
import { Option } from "../../interfaces/Option";
import { useState } from "react";
import { Page } from "../../@types/page";
import Pagination from "../Pagination/Pagination";
import FeedInputsGroups from "../Groups/FeedInputsGroups";

type Response = {
  id: string;
  profile_photo?: string;
  name: string;
  specie: string;
  race: string;
  gender: string;
  weight: string;
  prognosis: string;
  diagnosis: Option[];
  physical_shape: string;
};

const Feed = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const { data, isLoading } = useQuery({
    queryKey: ["pacient-list", currentPage],
    queryFn: async () => {
      const response = await api.get<Page<Response>>(
        `/patient/pages?page=${currentPage}`
      );
      return response.data;
    },
    enabled: true
  });

  return (
    <div className="w-full h-full flex flex-col gap-6 items-center">
      <FeedInputsGroups />
      <div className={"w-[1280px] h-full flex flex-col gap-6"}>
        <div className={"w-[1280px] h-full flex flex-col gap-6"}>
          {isLoading ? (
            <>
              <DataPatientCardsSkeleton />
              <DataPatientCardsSkeleton />
              <DataPatientCardsSkeleton />
              <DataPatientCardsSkeleton />
              <DataPatientCardsSkeleton />
              <DataPatientCardsSkeleton />
            </>
          ) : (
            data?.results.map((data) => (
              <DataPatientCard
                key={data.id}
                id={data.id}
                name={data.name}
                race={data.race}
                specie={data.specie}
                profile_photo={data.profile_photo}
                prognosis={data.prognosis}
                physical_shape={data.physical_shape}
                gender={data.gender}
                weight={data.weight}
                diagnosis={data.diagnosis}
                exams={["Hemograma"]}
              />
            ))
          )}
        </div>
        <div className="w-full h-8">
          {data?.info && (
            <Pagination
              limit={data.info.size}
              total={data.info.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
