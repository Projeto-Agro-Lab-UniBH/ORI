interface TitleProps {
  text: string;
}

export function Title(props: TitleProps) {
  return (
    <h2 className="mb-4 text-brand-standard-black text-4xl font-black">
      {props.text}
    </h2>
  );
}
