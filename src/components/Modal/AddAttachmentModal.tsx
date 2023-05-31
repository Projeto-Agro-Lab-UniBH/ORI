import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Label } from "../Label/Label";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { api } from "../../providers/Api";
import Select from "react-select";

type AddAttachmentModalProps = {
  patientId: string | null;
};

// const registerReportFormSchema = z.object({
//   shift: z.any(),
//   author: z.string().nonempty("Nome completo não pode ser nulo"),
//   report_text: z.string().nonempty("Relatório não pode ser nulo"),
//   // attachments: z.any(),
// });

// type registerReportFormData = z.infer<typeof registerReportFormSchema>;

// type ReportResponse = {
//   id: string;
//   patientId: string;
//   shift: string;
//   author: string;
//   report_text: string;
//   createdAt: string;
//   updatedAt: string;
//   // attachments: string[];
// };

const AddAttachmentModal = (props: AddAttachmentModalProps) => {
  // const {
  //   reset,
  //   register,
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<registerReportFormData>({
  //   resolver: zodResolver(registerReportFormSchema),
  // });

  const [open, setOpen] = useState<boolean>(false);

  // const queryClient = useQueryClient();

  // const { mutate } = useMutation({
  //   mutationKey: ["create-report"],
  //   mutationFn: async (data: registerReportFormData) => {
  //     await api.post<ReportResponse>("/report", {
  //       ...data,
  //       patientId: props.patientId,
  //     });
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("list-all-reports");
  //     reset();
  //     setOpen(false);
  //   },
  // });

  // const send = (data: registerReportFormData) => {
  //   const request = {
  //     ...data,
  //   };
  //   mutate(request);
  // };

  // useEffect(() => {
  //   if (open != true) {
  //     reset();
  //   }
  // }, [open, reset]);

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger className="border border-gray-200 flex items-center px-3 py-[6px] gap-1 rounded text-base text-brand-standard-black font-medium bg-white hover:border-[#b3b3b3] cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#212529"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
          />
        </svg>
        Adicionar um anexo
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
        <Dialog.Content className="w-[608px] rounded-lg border border-gray-200 fixed pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white overflow-hidden">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Anexar documento
            </Dialog.Title>
            <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center">
              <Cross1Icon width={24} height={24} />
            </Dialog.Close>
          </div>
          <div className="w-full px-6 py-6">
            <form className="w-full flex flex-col h-360 gap-6">
              <div className="w-full">
                <label
                  className="mb-2 inline-block text-brand-standard-black cursor-pointer"
                  htmlFor="patient-photo-file"
                >
                  Anexar arquivo
                </label>
                <input
                  className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-brand-standard-black transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-brand-standard-black file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:text-brand-standard-black focus:outline-none cursor-pointer"
                  id="patient-photo-file"
                  accept=".doc, .docx, .pdf"
                  type="file"
                />
              </div>
              <div className="w-full flex flex-col gap-3">
                <div className="w-full flex justify-end">
                  <button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddAttachmentModal;
