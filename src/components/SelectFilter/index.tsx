import Select from "react-select";
import { useState } from "react";
import { Option } from "../../interfaces/Option";

const SelectFilter = ({
  field,
  value,
  placeholder,
  options,
  onChange,
}: {
  field: string;
  value: Option | null;
  placeholder: string;
  options: Option[];
  onChange: (option: Option | null) => void;
}) => {
  const [instanceId] = useState(Math.random().toString());
  
  return (
    <div className={`w-[200px]`}>
      <Select
        instanceId={instanceId}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            width: "100%",
            height: 40,
            borderColor: state.isFocused
              ? "#64748b"
              : "#cbd5e1",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontWeight: 400,
            fontFamily: "Inter",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          }),
          input: (styles) => ({
            ...styles,
            fontWeight: 400,
            fontFamily: "Inter",
            borderColor: "#cbd5e1",
            ":hover": { borderColor: "#94a3b8" },
          }),
          dropdownIndicator: (styles) => ({
            ...styles,
            color: "#94a3b8",
            ":hover": { color: "#64748b" },
          }),
          clearIndicator: (styles) => ({
            ...styles,
            color: "#94a3b8",
            ":hover": { color: "#64748b" },
          }),
          indicatorSeparator: (styles) => ({
            ...styles,
            backgroundColor: "#94a3b8"
          }),
          placeholder: (styles) => ({
            ...styles,
            fontWeight: 400,
            fontFamily: "Inter",
            color: "#94a3b8",
          }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 4,
          colors: {
            ...theme.colors,
            primary50: "#f8fafc",
            primary25: "#f8fafc",
            primary: "#0f172a",
          },
        })}
        isClearable
        isSearchable={false}
        value={value}
        placeholder={placeholder}
        options={options}
        onChange={(option) => onChange(option)}
      />
    </div>
  );
}

export default SelectFilter;