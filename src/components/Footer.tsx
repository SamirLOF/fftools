const Footer = () => {
  return (
    <footer className="py-4 border-t border-border/50 mt-auto">
      <div className="container px-6">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} <span className="text-primary font-medium">LEAKS OF FF</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
