import * as Avatar from "@radix-ui/react-avatar";
import EditUserProfileModal from "./Modal/EditUserProfileModal";
import { PersonIcon } from "@radix-ui/react-icons";

type UserProfileProps = {
  id: string | undefined | null;
  profile_photo: string | undefined | null;
  username: string | undefined | null;
  email: string | undefined | null;
};

const UserProfile = (props: UserProfileProps) => {
  return (
    <div className="w-[300px] flex items-center gap-2">
      <EditUserProfileModal id={props.id}>
        <Avatar.Root
          className={
            !props.profile_photo
              ? "w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden"
              : "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
          }
        >
          {!props?.profile_photo ? (
            <div className="w-[14px] h-[14px]">
              <PersonIcon
                color="#e5e7eb"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <Avatar.Image
              className="w-full h-full object-cover"
              src={props.profile_photo}
            />
          )}
        </Avatar.Root>
      </EditUserProfileModal>
      <div className="w-[244px] h-14 flex justify-center items-center flex-col">
        <div className="w-[244px] flex">
          <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[18px] font-semibold text-brand-standard-black">
            {!props.username ? null : props.username}
          </p>
        </div>
        <div className="w-[244px] flex">
          <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[14px] font-light text-brand-standard-black">
            {!props.email ? null : props.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
