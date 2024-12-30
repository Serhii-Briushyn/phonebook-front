import { createSelector } from "@reduxjs/toolkit";
import { selectFilter } from "../filters/selectors";

export const selectContacts = (state) => state.contacts.items;
export const selectCurrentContact = (state) => state.contacts.currentContact;
export const selectIsLoading = (state) => state.contacts.isLoading;
export const selectError = (state) => state.contacts.isError;
export const selectSorting = (state) => state.contacts.sorting;

export const selectSortedContacts = createSelector(
  [selectContacts, selectFilter, selectSorting],
  (contacts, filter, sorting) => {
    const normalizedFilter = filter.toLowerCase();

    const filteredContacts = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(normalizedFilter) ||
        contact.number.includes(normalizedFilter)
    );

    return filteredContacts.sort((a, b) => {
      if (sorting === "name") {
        return a.name.localeCompare(b.name);
      } else if (sorting === "date") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
  }
);
