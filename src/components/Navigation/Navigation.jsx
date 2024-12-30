import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiMenu2Fill, RiCloseFill } from "react-icons/ri";
import clsx from "clsx";

import { selectIsLoggedIn } from "../../redux/auth/selectors";

import css from "./Navigation.module.css";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const buildLinkClass = ({ isActive }) => {
    return clsx(css.link, isActive && css.activeLink);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className={css.wrapper}>
      {isLoggedIn && (
        <>
          <div className={css.menuDesktop}>
            <NavLink className={buildLinkClass} to="/">
              Home
            </NavLink>

            <NavLink className={buildLinkClass} to="/contacts">
              Contacts
            </NavLink>
          </div>

          <button className={css.button} onClick={toggleMenu}>
            <RiMenu2Fill />
          </button>

          <div className={clsx(css.menuModal, isMenuOpen && css.open)}>
            <button className={css.closeButton} onClick={toggleMenu}>
              <RiCloseFill />
            </button>
            <NavLink className={buildLinkClass} to="/" onClick={toggleMenu}>
              Home
            </NavLink>

            <NavLink
              className={buildLinkClass}
              to="/contacts"
              onClick={toggleMenu}
            >
              Contacts
            </NavLink>
          </div>
        </>
      )}

      {!isLoggedIn && (
        <NavLink className={buildLinkClass} to="/">
          Home
        </NavLink>
      )}
    </nav>
  );
};
