import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { fetchGroupsById, fetchMessagesById } from "../actionCreators/chatCreator";

export interface IChatState {
    groups?: any[],
    messages?: any[]
}

const initialState: IChatState = {
    groups: [],
    messages: []
}
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessages(state: IChatState, action: PayloadAction<IChatState>) {
            state.messages = action.payload.messages
        },
        setGroups(state: IChatState, action: PayloadAction<IChatState>) {
            state.groups = action.payload.groups

        }
    },
    extraReducers: {
        [fetchGroupsById.fulfilled.type]: (state, action: PayloadAction<IChatState>) => {
            // state.groups = action.payload.groups
        },
        [fetchMessagesById.fulfilled.type]: (state, action: PayloadAction<IChatState>) => {
            // console.log(action);
        }
    }
})

export const { setMessages, setGroups } = chatSlice.actions

export default chatSlice.reducer