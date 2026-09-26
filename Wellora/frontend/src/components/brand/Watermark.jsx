import { WelloraGlyph } from "./WelloraLogo.jsx";

export default function Watermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-6 right-8 z-0 opacity-[0.04]"
    >
      <WelloraGlyph size={340} />
    </div>
  );
}
