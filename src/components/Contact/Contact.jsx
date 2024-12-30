import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaRegTrashCan, FaRegUser } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";
import { FiPhone } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import { deleteContact } from "../../redux/contacts/operations";
import {
  clearCurrentContact,
  setCurrentContact,
} from "../../redux/contacts/slice";
import { slideInFromLeft, slideInFromRight } from "../../motion/motion";

import Modal from "../Modal/Modal";
import EditContact from "../EditContact/EditContact";

import css from "./Contact.module.css";

function Contact({ contact, index, isOpen, toggleMenu }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteContact(contact._id));
      toast.success("Contact deleted successfully!");
      setShowModal(false);
      toggleMenu();
    } catch {
      toast.error("Failed to delete contact!");
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const handleEdit = () => {
    dispatch(setCurrentContact(contact));
    setIsEditing(true);
    toggleMenu();
  };

  const closeEditModal = () => {
    setIsEditing(false);
    dispatch(clearCurrentContact());
  };

  return (
    <AnimatePresence mode="wait">
      <motion.li
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={
          index % 2 === 0
            ? slideInFromLeft(index * 0.1)
            : slideInFromRight(index * 0.1)
        }
        className={css.item}
      >
        <div className={css.wrapper}>
          <p className={css.text}>
            <FaRegUser />
            {contact.name}
          </p>
          <p className={css.text}>
            <FiPhone />
            {contact.number}
          </p>
        </div>

        <button
          className={`${css.button} ${isOpen ? css.buttonActive : ""} `}
          onClick={toggleMenu}
        >
          <GoKebabHorizontal />
        </button>

        <div className={`${css.menu} ${isOpen ? css.open : ""}`}>
          <button className={css.menuButton} onClick={handleEdit}>
            <FaEdit /> Edit
          </button>
          <button className={css.menuButton} onClick={handleDelete}>
            <FaRegTrashCan /> Delete
          </button>
        </div>

        {showModal && (
          <Modal
            contact={contact}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}

        {isEditing && (
          <EditContact contact={contact} onClose={closeEditModal} />
        )}
      </motion.li>
    </AnimatePresence>
  );
}

export default Contact;
