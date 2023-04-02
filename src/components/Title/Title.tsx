interface TitleProps {
  text: string;
}

export function Title(props: TitleProps) {
  return (
    <h2 className="w-full text-brand-standard-black text-4xl font-black">
      {props.text}
    </h2>
  );
}
