import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Note {
  id: string;
  content: string;
  createdAt: Date;
}

interface NotesState {
  notes: Array<Note>;
}

const initialState: NotesState = {
  notes: [],
};

export const NotesSlice = createSlice({
  name: "Notes",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    removeNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    updateNote: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      const note = state.notes.find((note) => note.id === action.payload.id);
      if (note) {
        note.content = action.payload.content;
      }
    },
    setNotes: (state, action: PayloadAction<Array<Note>>) => {
      state.notes = action.payload; // Replace existing notes with new array
    },
    notesSliceReset: () => initialState,
  },
});

export const { addNote, removeNote, updateNote, setNotes, notesSliceReset } =
  NotesSlice.actions;

export default NotesSlice.reducer;
