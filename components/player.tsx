import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

export default function Player() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-900 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto h-full px-4">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-800 rounded"></div>
            <div>
              <h4 className="text-sm font-medium">Track Name</h4>
              <p className="text-xs text-neutral-400">Artist Name</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-neutral-400 hover:text-neutral-50 transition">
              <SkipBack size={20} />
            </button>
            <button className="text-neutral-400 w-8 h-8 flex items-center justify-center rounded-full hover:scale-105 transition hover:text-neutral-50">
              <Play size={20} />
            </button>
            <button className="text-neutral-400 hover:text-neutral-50 transition">
              <SkipForward size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 size={20} className="text-neutral-400" />
            <div className="w-24 h-1 bg-neutral-800 rounded-full">
              <div className="w-1/2 h-full bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
