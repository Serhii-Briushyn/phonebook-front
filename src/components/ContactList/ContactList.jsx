import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiGrid } from "react-icons/fi";
import { FaListUl } from "react-icons/fa6";
import { TypeAnimation } from "react-type-animation";

import {
  selectSortedContacts,
  selectSorting,
} from "../../redux/contacts/selectors";
import { selectFilter } from "../../redux/filters/selectors";
import { setSorting } from "../../redux/contacts/slice";

import Contact from "../Contact/Contact";

import css from "./ContactList.module.css";

function ContactList() {
  const dispatch = useDispatch();
  const [openContactId, setOpenContactId] = useState(null);
  const sorting = useSelector(selectSorting);
  const contacts = useSelector(selectSortedContacts);
  const filter = useSelector(selectFilter);
  const [viewMode, setViewMode] = useState("grid");
  const [textColor, setTextColor] = useState("#00FFFF");

  useEffect(() => {
    const savedViewMode = localStorage.getItem("viewMode");
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  const toggleMenu = (contactId) => {
    setOpenContactId((prevId) => (prevId === contactId ? null : contactId));
  };

  const handleSortChange = (e) => {
    dispatch(setSorting(e.target.value));
  };

  const handleViewChange = () => {
    const newViewMode = viewMode === "grid" ? "list" : "grid";
    setViewMode(newViewMode);
    localStorage.setItem("viewMode", newViewMode);
  };

  return (
    <>
      <div className={css.viewStyles}>
        <button className={css.button} onClick={handleViewChange}>
          {viewMode === "grid" ? <FaListUl /> : <FiGrid />}
        </button>
      </div>

      <select
        value={sorting}
        className={css.select}
        onChange={handleSortChange}
      >
        <option value="name">By Name</option>
        <option value="date">By Date</option>
      </select>

      {contacts.length === 0 ? (
        filter ? (
          <p className={css.noFound}>No contacts found 😔</p>
        ) : (
          <div
            className={css.noContacts}
            style={{
              color: textColor,
            }}
          >
            <TypeAnimation
              sequence={[
                "Add",
                800,
                () => setTextColor("#ffa500"),
                "Add your",
                800,
                () => setTextColor("#0000ff"),
                "Add your first",
                800,
                () => setTextColor("#ff00ff"),
                "Add your first contact",
                1000,
                () => setTextColor("#7fff00"),
                "",
              ]}
              repeat={Infinity}
            />
          </div>
        )
      ) : (
        <ul className={viewMode === "grid" ? css.grid : css.list}>
          {contacts.map((contact, index) => (
            <Contact
              key={contact._id}
              contact={contact}
              index={index}
              isOpen={openContactId === contact._id}
              toggleMenu={() => toggleMenu(contact._id)}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default ContactList;
