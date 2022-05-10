import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { AppDispatch } from "..";
import { UsersType } from "../slices/UserSlice";

export const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async (_, thunkApi) => {
        try {
            let users: UsersType[] = []
            const querySnapshot = await getDocs(collection(getFirestore(), "users"))
            querySnapshot.forEach((doc) => {
                if (doc) {
                    users.push({
                        email: doc.data().email,
                        uid: doc.id,
                        username: doc.data().username
                    })
                }
            });
            return users
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)

export const addUser = (email: string, username: string, uid: string) => async (dispatch: AppDispatch) => {
    try {
        await setDoc(doc(getFirestore(), "users", uid), { username, email });
    } catch (e) {
        console.log(e);
    }
}