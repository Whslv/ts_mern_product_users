export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar_header">
        <a href="/dashboard" className="navbar_title app-name">
          Price Builder
        </a>
        <a href="#menu" className="navbar_menu icon" aria-label="Menu"></a>
      </div>
    </nav>
  );
};
