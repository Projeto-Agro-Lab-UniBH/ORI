import { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  text: string;
}

export function Label(props: LabelProps) {
  return (
    <label
      {...props}
      className="w-full text-sm font-normal text-brand-standard-black"
    >
      {props.text}
    </label>
  );
}
