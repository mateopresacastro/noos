import SamplePack from "@/components/sample-pack";
import Image from "next/image";
import Link from "next/link";
import { searchSample, searchSamplePacks, searchUser } from "@/db/mod";

export default async function Search(props: {
  searchParams?: Promise<{
    q?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";

  const [users, packs, samples] = await Promise.all([
    searchUser(query, 3),
    searchSamplePacks(query, 3),
    searchSample(query, 6),
  ]);

  console.dir({ packs, users, samples }, { depth: null });

  return (
    <div className="pt-32 max-w-3xl mx-auto flex flex-col items-start justify-start gap-20 w-full pb-32 min-h-screen">
      {query !== "" ? (
        <>
          <UserResults users={users} />
          <SamplePackResults packs={packs} />
          <SampleResults samples={samples} />
        </>
      ) : (
        <p> Please enter a search term</p>
      )}
    </div>
  );
}

function UserResults({
  users,
}: {
  users: Awaited<ReturnType<typeof searchUser>>;
}) {
  return (
    <div className="w-full">
      <h4 className="text-xl font-bold pb-4">Producers</h4>
      {users && users.length > 0 ? (
        <div className="flex items-center justify-center flex-col gap-4">
          {users.map((user) => (
            <div
              key={user.userName}
              className="flex items-center justify-center w-full"
            >
              <Link
                href={`/${user.userName}`}
                className="flex items-center justify-start w-full hover:bg-neutral-900 px-4 py-2 -ml-8 rounded-xl active:bg-neutral-800 transition-colors duration-150"
                prefetch={true}
              >
                <Image
                  src={user.imgUrl}
                  alt={user.userName}
                  width={50}
                  height={50}
                  className="size-10 rounded-full object-cover mr-2 self-center"
                />
                <div className="flex flex-col items-center justify-center">
                  <span className="block font-bold">{user.name}</span>
                  <span className="block text-neutral-400 transition-colors text-sm">
                    @{user.userName}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-neutral-400 text-sm block">
          No producers found
        </span>
      )}
    </div>
  );
}

function SamplePackResults({
  packs,
}: {
  packs: Awaited<ReturnType<typeof searchSamplePacks>>;
}) {
  return (
    <div className="w-full">
      <h4 className="text-xl font-bold pb-4">Sample Packs</h4>
      {packs && packs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-14 w-full">
          {packs.map((pack) => (
            <SamplePack
              key={pack.title}
              samplePack={pack}
              userName={pack.creator.userName}
            />
          ))}
        </div>
      ) : (
        <span className="text-neutral-400 text-sm block">
          No sample packs found
        </span>
      )}
    </div>
  );
}
function SampleResults({
  samples,
}: {
  samples: Awaited<ReturnType<typeof searchSample>>;
}) {
  return (
    <div className="w-full">
      <h4 className="text-xl font-bold pb-4">Samples</h4>
      {samples && samples.length > 0 ? (
        <div className="flex flex-col w-full gap-4">
          {samples.map((sample, index) => (
            <Link
              href={`/${sample.samplePack.creator.userName}/${sample.samplePack.name}`}
              key={sample.title.concat(String(index))}
              className="flex w-[100%+6rem] cursor-pointer items-center justify-between rounded-lg transition-colors duration-150 ease-in-out hover:bg-neutral-900 h-16 pl-3 -ml-3 sm:-ml-3"
            >
              <div className="flex items-center justify-start">
                <div>
                  <span className="block pl-1 text-neutral-50">
                    {sample.title}
                  </span>
                  <span className="block text-xs sm:text-sm pl-1 text-neutral-400 transition-colors">
                    @{sample.samplePack.creator.userName}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <span className="text-neutral-400 text-sm block">No samples found</span>
      )}
    </div>
  );
}
