import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

interface RoomChatState {
  chatHistory: ChatMessage[];
}

const initialState: RoomChatState = {
  chatHistory: [],
};

export const roomChatSlice = createSlice({
  name: "RoomChat",
  initialState,
  reducers: {
    addChat: (state, action: PayloadAction<ChatMessage>) => {
      state.chatHistory.push(action.payload);
    },
    roomChatSliceReset: () => initialState,
  },
});

export const { addChat, roomChatSliceReset } = roomChatSlice.actions;

export default roomChatSlice.reducer;
