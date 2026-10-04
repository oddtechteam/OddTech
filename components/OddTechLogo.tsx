import { asset } from "@/lib/oddtech";

// The OddTech logo mark ("ODD Tech", without the tagline), from public/logo-oddtech.png.
// Its artwork is on white, so it sits on a white badge wherever the background is dark.
export default function OddTechLogo({ size = 34, badge = false }: { size?: number; badge?: boolean }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset("/logo-oddtech.png")} alt="OddTech IT Solutions" width={620} height={400} style={{ height: size, width: "auto" }} className="block" />
  );
  return badge ? <span className="inline-flex flex-shrink-0 items-center rounded-2xl bg-white px-2.5 py-1.5">{img}</span> : img;
}
