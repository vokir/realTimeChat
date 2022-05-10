import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsers } from "../actionCreators/userCreator";

export type UsersType = {
    username: string,
    email: string,
    uid: string
}

export interface IUserState {
    email: string,
    uid: string,
    username: string,
    users: UsersType[]
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
    },
    extraReducers: {
        [fetchUsers.fulfilled.type]: (state, action: PayloadAction<UsersType[]>) => {
            state.users = action.payload
        },
    }
})

export const { setUser, removeUser } = userSlice.actions

export default userSlice.reducer