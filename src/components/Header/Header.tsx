import { ExitIcon } from "@radix-ui/react-icons";
import { useAuthContext } from "../../contexts/AuthContext";
import UserProfile from "../UserProfile";
import UserProfileSkeleton from "../Skeletons/UserProfileSkeleton";

type User = {
  id: string;
  profile_photo: string;
  username: string;
  email: string;
};

type HeaderProps = {
  user: User | null;
};

const Header = (props: HeaderProps) => {
  const { logOut } = useAuthContext();

  return (
    <div className="w-full h-20 flex justify-center">
      <div className="w-[1280px] flex justify-between">
        {!props.user ? (
          <UserProfileSkeleton />
        ) : (
          <UserProfile
            id={props.user?.id}
            profile_photo={props.user?.profile_photo}
            username={props.user?.username}
            email={props.user?.email}
          />
        )}
        <div className="w-14 flex justify-end items-center">
          <button
            onClick={() => logOut()}
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
