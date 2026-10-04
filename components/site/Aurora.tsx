// Slowly drifting aurora blobs + faded grid, for dark sections. CSS-only.
export default function Aurora({ intense = false }: { intense?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div
        className={`absolute -right-[10%] -top-[30%] h-[42rem] w-[42rem] rounded-full bg-brand blur-[120px] ${intense ? "opacity-60" : "opacity-40"}`}
        style={{ animation: "blob 18s ease-in-out infinite" }}
      />
      <div
        className={`absolute -left-[12%] top-[20%] h-[32rem] w-[32rem] rounded-full bg-aqua blur-[120px] ${intense ? "opacity-30" : "opacity-20"}`}
        style={{ animation: "blob 22s ease-in-out infinite reverse" }}
      />
      <div
        className={`absolute bottom-[-30%] left-[35%] h-[30rem] w-[30rem] rounded-full bg-plum blur-[130px] ${intense ? "opacity-40" : "opacity-25"}`}
        style={{ animation: "blob 26s ease-in-out infinite" }}
      />
    </div>
  );
}
