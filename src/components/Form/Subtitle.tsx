interface SubtitleProps {
  text: string;
}

export function Subtitle(props: SubtitleProps) {
  return (
    <p className="mb-8 text-brand-standard-black text-2xl font-light">
      {props.text}
    </p>
  );
}
