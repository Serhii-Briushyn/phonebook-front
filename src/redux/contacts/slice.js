import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import {
  addContact,
  deleteContact,
  fetchContacts,
  updateContact,
} from "./operations";
import { logout } from "../auth/operations";

const initialState = {
  items: [],
  currentContact: null,
  isLoading: false,
  isError: null,
  sorting: "name",
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setCurrentContact: (state, action) => {
      state.currentContact = action.payload;
    },
    clearCurrentContact: (state) => {
      state.currentContact = null;
    },
    setSorting: (state, action) => {
      state.sorting = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.items = action.payload.data.contacts;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (contact) => contact._id === action.payload
        );
        state.items.splice(index, 1);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (contact) => contact._id === action.payload.data._id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.items = [];
        state.isError = null;
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(
          fetchContacts.pending,
          addContact.pending,
          deleteContact.pending,
          updateContact.pending
        ),
        (state) => {
          state.isLoading = true;
          state.isError = null;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchContacts.fulfilled,
          addContact.fulfilled,
          deleteContact.fulfilled,
          updateContact.fulfilled
        ),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchContacts.rejected,
          addContact.rejected,
          deleteContact.rejected,
          updateContact.rejected
        ),
        (state, action) => {
          state.isLoading = false;
          state.isError = action.payload;
        }
      );
  },
});

export const contactsReducer = contactsSlice.reducer;
export const { setCurrentContact, clearCurrentContact, setSorting } =
  contactsSlice.actions;
