import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ruthiMainState {
  role: string; // Change 'String' to 'string'
  roomId: string; // Change 'String' to 'string'
  myPeerId: string; // Change 'String' to 'string'
}

const initialState: ruthiMainState = {
  role: "",
  roomId: "",
  myPeerId: "",
};

export const ruthiMainSlice = createSlice({
  name: "RuthiMain",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload; // No changes needed here
    },
    deleteRole: (state) => {
      state.role = "";
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload; // No changes needed here
    },
    deleteRoomId: (state) => {
      state.roomId = "";
    },
    setMyPeerId: (state, action: PayloadAction<string>) => {
      state.myPeerId = action.payload; // No changes needed here
    },
    ruthiMainSliceReset: () => initialState,
  },
});

export const {
  setRole,
  deleteRole,
  setRoomId,
  deleteRoomId,
  setMyPeerId,
  ruthiMainSliceReset,
} = ruthiMainSlice.actions;

export default ruthiMainSlice.reducer;
