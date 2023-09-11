import Select from "react-select";
import { useState } from "react";
import { SelectSchema } from "../../@types/SelectSchema";

const SelectFilter = ({
  field,
  value,
  placeholder,
  options,
  onChange,
}: {
  field: string;
  value: SelectSchema | null;
  placeholder: string;
  options: SelectSchema[];
  onChange: (option: SelectSchema | null) => void;
}) => {
  const [instanceId] = useState(Math.random().toString());
  
  return (
    <div className={`w-[200px] h-24 flex items-center`}>
      <Select
        instanceId={instanceId}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            width: 200,
            height: 40,
            borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
            borderRadius: 4,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          }),
        }}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary75: "#cbd5e1",
            primary50: "#e2e8f0",
            primary25: "#f8fafc",
            primary: "#212529",
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