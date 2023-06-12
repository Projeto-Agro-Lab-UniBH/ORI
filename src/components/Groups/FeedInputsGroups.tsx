import { useId, useState } from "react";
import Select from "react-select";
import RegisterPatientModal from "../Modal/RegisterPatientModal";

type SelectTypes = {
  label: string;
  value: string;
};

const prognosisOptions = [
  { value: "Alta", label: "Alta" },
  { value: "Aguardando alta médica", label: "Aguardando alta médica" },
  { value: "Obscuro", label: "Obscuro" },
  { value: "Desfávoravel", label: "Desfávoravel" },
  { value: "Reservado", label: "Reservado" },
  { value: "Favorável", label: "Favorável" },
  { value: "Risco", label: "Risco" },
  { value: "Alto risco", label: "Alto risco" },
];

const physicalShapeOptions = [
  { value: "Grande porte", label: "Grande porte" },
  { value: "Médio porte", label: "Médio porte" },
  { value: "Pequeno porte", label: "Pequeno porte" },
];

const genderOptions = [
  { value: "Macho", label: "Macho" },
  { value: "Fêmea", label: "Fêmea" },
];

const FeedInputsGroups = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectPrognosis, setSelectPrognosis] = useState<SelectTypes | null>();
  const [selectPhysicalShape, setSelectPhysicalShape] = useState<SelectTypes | null>();
  const [selectGender, setSelectGender] = useState<SelectTypes | null>();

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className="w-[1280px] h-24 flex items-center flex-col border-b border-gray-200">
      <div className="w-full h-24 flex items-center gap-3">
        <div className="w-[200px] h-24 flex items-center">
          <Select
            instanceId={useId()}
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
            placeholder="Filtrar prognóstico"
            options={prognosisOptions}
            onChange={(value) => setSelectPrognosis(value)}
          />
        </div>
        <div className="w-[200px] h-24 flex items-center">
          <Select
            instanceId={useId()}
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
            placeholder="Filtrar porte físico"
            options={physicalShapeOptions}
            onChange={(value) => setSelectPhysicalShape(value)}
          />
        </div>
        <div className="w-[178px] h-24 flex items-center">
          <Select
            instanceId={useId()}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                width: 178,
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
            placeholder="Filtrar por gênero"
            options={genderOptions}
            onChange={(value) => setSelectGender(value)}
          />
        </div>
        <div className="w-full h-24 flex items-center">
          <input
            type="text"
            id="search"
            className="w-full h-10 p-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:border-[#b3b3b3]"
            placeholder=""
            value={searchInput}
            onChange={handleSearchInput}
          />
        </div>
        <div className="w-24">
          <button className="w-24 h-10 bg-brand-standard-black rounded text-white font-normal hover:border hover:bg-white hover:text-brand-standard-black">
            Buscar
          </button>
        </div>
        <div className="w-10 h-24 flex items-center">
          <RegisterPatientModal />
        </div>
      </div>
    </div>
  );
};

export default FeedInputsGroups;
