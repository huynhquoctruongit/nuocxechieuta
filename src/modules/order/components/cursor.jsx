import { createImage } from "@/lib/helper";
import { MousePointer2 } from "lucide-react";

export default function Cursor({ color, x, y, message, profile }) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-[100000]"
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
    >
      <MousePointer2 className={" stroke-none fill-primary-01"} />
      <div className="absolute top-full left-1/2 flex items-center gap-2">
        <div className="w-10 h-10 bg-white shadow-md rounded-full">
          <img src={createImage(profile.avatar, 100)} alt="avatar" className="w-full h-full object-cover" />
        </div>

        {message && (
          <div className="rounded-3xl px-4 py-2" style={{ backgroundColor: color, borderRadius: 20 }}>
            <p className="whitespace-nowrap text-sm leading-relaxed text-white">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
