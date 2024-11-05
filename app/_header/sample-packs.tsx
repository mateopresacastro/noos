"use client";

import { Separator } from "@/components/ui/separator";
import { handleCreatePreSignedUrl } from "@/lib/aws/mod";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function SamplePacks() {
  return (
    <div className="flex flex-col items-start justify-center w-full h-full">
      <h4 className="font-bold">Sample packs</h4>
      <Separator className="my-4 text-neutral-200" />
    </div>
  );
}

// function MyDropzone() {
//   const [file, setFile] = useState<File | null>(null);
//   const { data, refetch } = useQuery({
//     queryKey: ["presignedUrl", file?.name],
//     queryFn: () => {
//       if (!file) return null;
//       return handleCreatePreSignedUrl("public", file.name);
//     },
//     enabled: false,
//   });

//   useEffect(() => {
//     async function upload() {
//       if (data) {
//         const res = await fetch(data.url, { method: "PUT", body: file });
//         if (!res.ok) {
//           console.error("error res not ok");
//         } else {
//           console.log("it worked!!!");
//         }
//       }
//     }

//     upload();
//   }, [data]);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     setFile(acceptedFiles[0]);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   return (
//     <div
//       {...getRootProps()}
//       className="mt-20 bg-neutral-600 p-10 rounded-lg cursor-pointer"
//     >
//       <input {...getInputProps()} />
//       {isDragActive ? (
//         <p>Drop the files here ...</p>
//       ) : (
//         <p>Drag 'n' drop some files here, or click to select files</p>
//       )}

//       {file && (
//         <div className="mt-10">
//           <button onClick={() => refetch()}>get url</button>
//           <a href={data?.url} target="_blank">
//             {data?.url}
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }
