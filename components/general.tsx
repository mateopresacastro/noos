import StorageUsed from "@/components/storage-used";

export default function General({ storageUsed }: { storageUsed: bigint }) {
  return (
    <div className="flex flex-col space-y-5 w-full items-start justify-start">
      <StorageUsed storageUsed={storageUsed} />
    </div>
  );
}
