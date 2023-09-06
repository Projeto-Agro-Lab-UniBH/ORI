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
    <div className="w-[1280px] h-20 flex justify-between">
      {!props.user ? (
          <UserProfileSkeleton />
        ) : (
        <div className="w-[300px] flex items-center gap-2">
          <EditUserProfileModal id={props.user.id}>
            <Avatar.Root className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden">
              <Avatar.Image
                src={props.user.profile_photo}
                className="w-full h-full object-cover"
              />
              <Avatar.Fallback className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full overflow-hidden" delayMs={600}>
                <PersonIcon width={14} height={14} color="#e5e7eb" />    
              </Avatar.Fallback>
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
          className="w-10 h-10 rounded flex justify-center items-center hover:border hover:border-gray-200"
        >
          <ExitIcon color="#212529" width={16} height={16} />
        </button>
      </div>
    </div>
  );
};

export default Header;
