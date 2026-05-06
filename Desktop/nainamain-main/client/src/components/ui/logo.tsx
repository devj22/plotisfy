import { Link } from "wouter";

interface LogoProps {
  wrapInLink?: boolean;
}

const Logo = ({ wrapInLink = true }: LogoProps) => {
  const logoContent = (
    <div className="flex items-center gap-2">
      <img
        src="https://i.ibb.co/WW73yyCn/Whats-App-Image-2025-03-28-at-2-02-20-PM-removebg-preview-2.png"
        alt="Nainaland Deals Logo"
        className="h-12 w-auto cursor-pointer"
      />
      <span className="text-xl font-semibold text-primary">Nainaland Deals</span>
    </div>
  );

  if (!wrapInLink) {
    return logoContent;
  }

  return (
    <Link href="/">
      {logoContent}
    </Link>
  );
};

export default Logo; 