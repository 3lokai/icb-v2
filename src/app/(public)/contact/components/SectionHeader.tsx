type SectionHeaderProps = {
  title: string;
  align?: "left" | "center";
};

export function SectionHeader({ title, align = "left" }: SectionHeaderProps) {
  const alignmentClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-8 ${alignmentClass}`}>
      <h2 className="mb-4 text-heading text-primary">{title}</h2>
      <div
        className={`mb-6 h-1 w-16 rounded-full bg-accent ${align === "center" ? "mx-auto" : ""}`}
      />
    </div>
  );
}
