import * as Tabs from "@radix-ui/react-tabs";

const PatientTabHeader = () => {
  return (
    <Tabs.List className="w-full h-10 pl-6 flex flex-wrap -mb-px text-sm font-medium text-center border-b border-gray-200">
      <Tabs.Trigger
        value="profile"
        id="button-tab"
        className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      >
        Perfil
      </Tabs.Trigger>
      <Tabs.Trigger
        value="reports"
        id="button-tab"
        className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      >
        Relatórios
      </Tabs.Trigger>
      <Tabs.Trigger
        value="exams"
        id="button-tab"
        className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      >
        Exames
      </Tabs.Trigger>
      <Tabs.Trigger
        value="attachments"
        id="button-tab"
        className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      >
        Arquivos
      </Tabs.Trigger>
    </Tabs.List>
  )
}

export default PatientTabHeader;