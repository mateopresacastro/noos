import { STORAGE_LIMIT_50_GB_IN_BYTES } from "@/consts";

export default function StorageUsed({ storageUsed }: { storageUsed: bigint }) {
  const percent = Number(
    (storageUsed * BigInt(100)) / STORAGE_LIMIT_50_GB_IN_BYTES
  );

  const usedStorageGB = (Number(storageUsed) / (1024 * 1024 * 1024)).toFixed(2);
  const totalStorageGB = (
    Number(STORAGE_LIMIT_50_GB_IN_BYTES) /
    (1024 * 1024 * 1024)
  ).toFixed(2);

  return (
    <div className="flex flex-col space-y-2 rounded-xl w-full pl-2">
      <div className="flex items-center justify-start w-full">
        <div>
          <div className="flex items-baseline flex-col sm:flex-row">
            <h3 className="text-nowrap pr-10 pb-2 text-sm">
              <span className="font-bold font-mono">{percent}</span>% of your
              storage limit is used
            </h3>
            <div className=" text-neutral-400 text-nowrap md:pl-10 text-xs pb-2 sm:pb-0 font-mono">
              {usedStorageGB} GB / {totalStorageGB} GB
            </div>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-1 overflow-hidden max-w-md justify-self-start">
            <div
              className="bg-neutral-200 h-1"
              style={{ width: `${percent + 2}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
