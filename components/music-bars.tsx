export default function MusicBars() {
  return (
    <div className="relative mr-2 flex h-[0.9rem] w-[0.8rem] justify-between">
      <span className="animate-music-bars delay-750 h-full w-0.5 origin-bottom rounded-md bg-neutral-50" />
      <span className="animate-music-bars delay-150 h-full w-0.5 origin-bottom rounded-md bg-neutral-50" />
      <span className="animate-music-bars delay-750 h-full w-0.5 origin-bottom rounded-md bg-neutral-50" />
      <span className="animate-music-bars h-full w-0.5 origin-bottom rounded-md bg-neutral-50" />
    </div>
  );
}
