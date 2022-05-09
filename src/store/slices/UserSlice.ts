import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserState {
    email?: string,
    uid?: string,
    username?: string,
    users?: Array<{
        username: string,
        email: string,
        uid: string
    }> | undefined
}

const initialState: IUserState = {
    email: '',
    uid: '',
    username: '',
    users: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.email = action.payload.email
            state.uid = action.payload.uid
            state.username = action.payload.username
        },
        removeUser(state) {
            state.email = ''
            state.uid = ''
            state.username = ''
        },
        usersFetching(state, action: PayloadAction<IUserState>) {
            state.users = action.payload.users
        }
    },
})

export const { setUser, removeUser, usersFetching } = userSlice.actions

export default userSlice.reducer