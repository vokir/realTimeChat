import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserState {
    email?: string,
    id?: string,
    users?: Array<{
        username: string,
        email: string,
        uid: string
    }> | undefined
}

const initialState: IUserState = {
    email: '',
    id: '',
    users: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.email = action.payload.email
            state.id = action.payload.id
        },
        removeUser(state) {
            state.email = ''
            state.id = ''
        },
        usersFetching(state, action: PayloadAction<IUserState>) {
            state.users = action.payload.users
        }
    }
})

export const { setUser, removeUser, usersFetching } = userSlice.actions

export default userSlice.reducer