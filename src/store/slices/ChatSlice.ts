import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GroupType = {
    id: string,
    name: string,
    createdAt: string,
    createdBy: string,
    members: string[]
}

export type MessagesType = {
    messageText: string,
    sentAt: string,
    sentBy: string
}

export interface IChatState {
    groups: GroupType[],
    messages: MessagesType[]
}

const initialState: IChatState = {
    groups: [],
    messages: []
}
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessages(state: IChatState, action: PayloadAction<MessagesType[]>) {
            state.messages = action.payload
        },
        setMessage(state: IChatState, action: PayloadAction<MessagesType[]>) {
            state.messages = action.payload.concat(state.messages)
        },
        setGroups(state: IChatState, action: PayloadAction<GroupType[]>) {
            state.groups = action.payload
        }
    },
})

export const { setMessages, setGroups, setMessage } = chatSlice.actions

export default chatSlice.reducer