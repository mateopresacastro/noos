export default function MusicBars() {
  return (
    <div className="relative mr-2 flex h-[0.85rem] w-3 justify-between">
      <span className="animate-music-bars h-full w-0.5 origin-bottom rounded-md bg-emerald-500" />
      <span className="animate-music-bars delay-500 h-full w-0.5 origin-bottom rounded-md bg-emerald-500" />
      <span className="animate-music-bars delay-750 h-full w-0.5 origin-bottom rounded-md bg-emerald-500" />
      <span className="animate-music-bars h-full w-0.5 origin-bottom rounded-md bg-emerald-500" />
    </div>
  );
}
