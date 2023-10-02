import Select from "react-select";
import { useId, useState } from "react";
import { Option } from "../../interfaces/Option";

const SelectFilter = ({
  width,
  field,
  value,
  placeholder,
  options,
  onChange,
}: {
  width: string;
  field: string;
  value: Option | null;
  placeholder: string;
  options: Option[];
  onChange: (option: Option | null) => void;
}) => {
  return (
    <div className={width}>
      <Select
        instanceId={useId()}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            width: "100%",
            height: 41.6,
            borderRadius: 8,
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
            borderRadius: 8,
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
          borderRadius: 8,
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