interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl sm:text-2xl font-display tracking-wider text-foreground">
        {title}
      </h2>
      <div className="section-line w-16 mt-2" />
    </div>
  );
};

export default SectionTitle;
