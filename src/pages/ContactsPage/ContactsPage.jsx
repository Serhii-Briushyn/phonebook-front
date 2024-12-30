import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { fetchContacts } from "../../redux/contacts/operations";
import { selectError, selectIsLoading } from "../../redux/contacts/selectors";

import ContactForm from "../../components/ContactForm/ContactForm";
import SearchBox from "../../components/SearchBox/SearchBox";
import ContactList from "../../components/ContactList/ContactList";
import Loader from "../../components/Loader/Loader";
import DocumentTitle from "../../components/DocumentTitle";

import css from "./ContactsPage.module.css";

export default function ContactPage() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  if (error) {
    toast.error(error);
  }

  return (
    <>
      <DocumentTitle>Contacts</DocumentTitle>
      <motion.div
        className={css.wrapper}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        <div className={css.formWrapper}>
          <ContactForm />
          <SearchBox />
        </div>

        {isLoading && !error && (
          <div className="loader">
            <Loader />
          </div>
        )}

        {!isLoading && !error && (
          <div className={css.contactsWrapper}>
            <ContactList />
          </div>
        )}
      </motion.div>
    </>
  );
}
