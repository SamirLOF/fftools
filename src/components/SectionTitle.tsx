interface SectionTitleProps {
  title: string;
}

const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="section-indicator h-8" />
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
  );
};

export default SectionTitle;
