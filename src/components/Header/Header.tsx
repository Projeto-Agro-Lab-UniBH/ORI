import * as Avatar from "@radix-ui/react-avatar";
import EditUserProfileModal from "../Modal/EditUserProfileModal";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import UserProfileSkeleton from "../Skeletons/UserProfileSkeleton";

type User = {
  id: string;
  profile_photo: string;
  username: string;
  email: string;
}

type HeaderProps = {
  user: User | null;
  logOut: () => void;
}

const Header = (props: HeaderProps) => {
  return (
    <div className="w-full h-20 flex justify-center">
      <div className="w-[1280px] flex justify-between">
        {!props.user ? (
            <UserProfileSkeleton />
          ) : (
          <div className="w-[300px] flex items-center gap-2">
            <EditUserProfileModal id={props.user.id}>
              <Avatar.Root
                className={
                  !props.user.profile_photo
                    ? "w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden"
                    : "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                }
              >
                {!props.user.profile_photo ? (
                  <div className="w-[14px] h-[14px]">
                    <PersonIcon
                      color="#e5e7eb"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <Avatar.Image
                    className="w-full h-full object-cover"
                    src={props.user.profile_photo}
                  />
                )}
              </Avatar.Root>
            </EditUserProfileModal>
            <div className="w-[244px] h-14 flex justify-center items-center flex-col">
              <div className="w-[244px] flex">
                <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[18px] font-semibold text-brand-standard-black">
                  {!props.user.username ? null : props.user.username}
                </p>
              </div>
              <div className="w-[244px] flex">
                <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[14px] font-light text-brand-standard-black">
                  {!props.user.email ? null : props.user.email}
                </p>
              </div>
            </div>
          </div>
          )
        }
        <div className="w-14 flex justify-end items-center">
          <button
            onClick={() => props.logOut()}
            className="w-8 h-8 rounded flex justify-center items-center hover:bg-slate-50"
          >
            <ExitIcon width={16} height={16} />
          </button>
        </div>
      </div>
    </div>

  );
};

export default Header;
