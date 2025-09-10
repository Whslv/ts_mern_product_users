import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar_header">
          <a href="/dashboard" className="navbar_title app-name">
            Price Builder
          </a>
          <button
            type="button"
            className={`navbar__toggle ${open ? "navbar_is-open" : ""} icon`}
            aria-label="Menu"
            onClick={() => {
              setOpen(!open);
            }}
          ></button>
        </div>
      </nav>

      <aside
        id="menu"
        className={`aside container ${open ? "aside_is-open" : ""}`}
      >
        <div className="aside_content">
          <ul className="aside_list">
            <li key="/dashboard" className="aside__block">
              <a href="/dasboard" className="dasboard__icon icon"></a>
              <Link
                href="/dashboard"
                className={`aside__link ${isActive("/dashboard") ? "aside__link-is-open" : ""}`}
                onClick={() => setOpen(false)}
              >
                dashboard
              </Link>
            </li>
            <li key="/products" className="aside__block">
              <a href="/products" className="products__icon icon"></a>

              <Link
                href="/products"
                className={`aside__link ${isActive("/products") ? "aside__link-is-open" : ""}`}
                onClick={() => setOpen(false)}
              >
                products
              </Link>
            </li>
            <li key="/add" className="aside__block">
              <a href="/add" className="add__icon icon"></a>

              <Link
                href="/add"
                className={`aside__link ${isActive("/add") ? "aside__link-is-open" : ""}`}
                onClick={() => setOpen(false)}
              >
                new product
              </Link>
            </li>
            <li key="/orders" className="aside__block">
              <a href="/orders" className="orders__icon icon"></a>

              <Link
                href="/orders"
                className={`aside__link ${isActive("/orders") ? "aside__link-is-open" : ""}`}
                onClick={() => setOpen(false)}
              >
                orders
              </Link>
            </li>
            <li key="/vendors" className="aside__block">
              <a href="/vendors" className="vendors__icon icon"></a>

              <Link
                href="/vendors"
                className={`aside__link ${isActive("/vendors") ? "aside__link-is-open" : ""}`}
                onClick={() => setOpen(false)}
              >
                vendors
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
