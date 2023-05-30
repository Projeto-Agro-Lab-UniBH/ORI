import * as Avatar from "@radix-ui/react-avatar";
import EditUserProfileModal from "../../components/Modal/EditUserProfileModal";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import { useAuthContext } from "../../contexts/AuthContext";

type User = {
  id: string; 
  profile_photo: string; 
  username: string; 
  email: string;
}

type HeaderProps = {
  currentUser: User | null;
}

const Header = (props: HeaderProps) => {
  const { logOut } = useAuthContext()

  return (
    <div className="w-full h-20 flex justify-center">
      <div className="w-[1280px] flex justify-between">
        <div className="w-[408px] flex items-center gap-2">
          <EditUserProfileModal id={props.currentUser?.id}>
            <Avatar.Root
              className={
                !props.currentUser?.profile_photo
                  ? "w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden"
                  : "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
              }
            >
              {!props.currentUser?.profile_photo ? (
                <div className="w-[14px] h-[14px]">
                  <PersonIcon
                    color="#e5e7eb"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Avatar.Image
                  className="w-full h-full object-cover"
                  src={props.currentUser?.profile_photo}
                />
              )}
            </Avatar.Root>
          </EditUserProfileModal>
          <div className="w-[352px] h-14 flex justify-center items-center flex-col">
            <div className="w-full flex text-[18px] font-semibold">
              {!props.currentUser?.username ? "Lorem Ipsum" : props.currentUser?.username}
            </div>
            <div className="w-full flex text-[14px] font-light">
              {!props.currentUser?.email ? "loremipsum@email.com" : props.currentUser?.email}
            </div>
          </div>
        </div>
        <div className="w-14 flex justify-end items-center">
          <button onClick={() => logOut()} className="w-8 h-8 rounded flex justify-center items-center hover:bg-slate-50">
            <ExitIcon width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header