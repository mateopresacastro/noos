import { STORAGE_LIMIT_50_GB_IN_BYTES } from "@/lib/consts";

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
    <div className="flex flex-col space-y-2 bg-neutral-900 rounded-xl p-5 w-full border border-neutral-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm text-nowrap pr-10 pb-3">
            <span className="font-bold">{percent}% </span>of your storage limit
            is used
          </h3>
          <div className="w-full bg-neutral-700 rounded-full h-1 overflow-hidden max-w-md justify-self-start">
            <div
              className="bg-neutral-200 h-1"
              style={{ width: `${Number(percent)}%` }}
            />
          </div>
        </div>
        <div className="text-sm text-neutral-400 text-nowrap pl-10">
          {usedStorageGB} GB / {totalStorageGB} GB
        </div>
      </div>
    </div>
  );
}
