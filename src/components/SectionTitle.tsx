interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
  return (
    <div className="flex flex-col gap-1 mb-8">
      <div className="flex items-center gap-4">
        <div className="section-line w-12" />
        <h2 className="text-4xl sm:text-5xl font-display tracking-wider cursed-text">
          {title.toUpperCase()}
        </h2>
      </div>
      {subtitle && (
        <p className="text-muted-foreground font-bold pl-16 tracking-wide uppercase text-sm">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionTitle;
