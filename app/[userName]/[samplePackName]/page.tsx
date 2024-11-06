import Image from "next/image";
import { getSamplePack } from "@/lib/db/mod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ userName: string; samplePackName: string }>;
}) {
  const { userName, samplePackName } = await params;
  const samplePack = await getSamplePack({ userName, samplePackName });

  if (!samplePack) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">
          Sample pack not found
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-40">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative h-32 w-32">
          <Image
            src={samplePack.imgUrl}
            alt={samplePack.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{samplePack.title}</h1>
          <Link href={`/${userName}`}>
            <p className="text-neutral-500">
              by @{samplePack.creator.userName}
            </p>
          </Link>
          {samplePack.description && (
            <p className="mt-2 text-neutral-600">{samplePack.description}</p>
          )}
          {samplePack.price && (
            <p className="mt-2 text-xl font-semibold">
              ${samplePack.price.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {samplePack.samples.map((sample) => (
          <Card key={sample.id}>
            <CardHeader>
              <CardTitle className="text-lg">{sample.title}</CardTitle>
              <CardDescription>
                Created {new Date(sample.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <audio controls className="w-full" src={sample.url}>
                Your browser does not support the audio element.
              </audio>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
