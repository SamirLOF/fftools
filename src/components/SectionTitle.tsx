interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionTitle;
