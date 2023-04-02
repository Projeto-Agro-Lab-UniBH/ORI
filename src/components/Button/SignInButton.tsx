type Props = {
  type?: "button" | "submit" | "reset";
  onClick?: VoidFunction;
  children: React.ReactNode;
};

export function SignInButton({ type = "button", onClick, children }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full h-10 bg-brand-standard-black py-2 px-16 text-base font-bold text-white outline-none overflow-hidden rounded hover:bg-white border-solid border-brand-standard-black border hover:text-brand-standard-black cursor-pointer"
    >
      {children}
    </button>
  );
}
