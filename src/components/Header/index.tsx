import * as Avatar from "@radix-ui/react-avatar";
import EditUserProfileModal from "../Modal/EditUserProfileModal";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import UserProfileSkeleton from "../Skeletons/HeaderUserProfileSkeleton";
import { useAuthContext } from "../../contexts/AuthContext";

const Header = () => {
  const { user, logOut } = useAuthContext();

  return (
    <div className="w-[1280px] h-20 flex justify-between">
      {!user ? (
        <UserProfileSkeleton />
      ) : (
        <div className="w-[300px] flex items-center gap-2">
          <EditUserProfileModal id={user.id}>
            <Avatar.Root className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden">
              <Avatar.Image
                src={user.profile_photo || ''}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <Avatar.Fallback
                className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-full overflow-hidden"
                delayMs={600}
              >
                <PersonIcon width={14} height={14} color="#e2e8f0" />
              </Avatar.Fallback>
            </Avatar.Root>
          </EditUserProfileModal>
          <div className="w-[244px] h-14 flex justify-center items-center flex-col">
            <div className="w-[244px] flex">
              <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[18px] font-semibold text-slate-700">
                {user.username || ''}
              </p>
            </div>
            <div className="w-[244px] flex">
              <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[14px] font-light text-slate-400">
                {user.email || ''}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="w-14 flex justify-end items-center">
        <button
          onClick={logOut}
          className="w-[41.6px] h-[41.6px] rounded-lg flex justify-center items-center hover:border hover:border-slate-300"
        >
          <ExitIcon color="#64748b" width={16} height={16} />
        </button>
      </div>
    </div>
  );
};

export default Header;
