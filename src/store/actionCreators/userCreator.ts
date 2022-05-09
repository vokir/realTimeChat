import { collection, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { AppDispatch } from "..";
import { usersFetching } from "../slices/UserSlice";

export const fetchUsers = () => async (dispatch: AppDispatch) => {
    try {
        let users: any[] = []
        const querySnapshot = await getDocs(collection(getFirestore(), "users"))
        querySnapshot.forEach((doc) => {
            users.push({ ...doc.data(), uid: doc.id })
        });
        dispatch(usersFetching({ users }))
    } catch (e) {
        console.log(e);
    }
}

export const addUser = (email: string, username: string, uid: string) => async (dispatch: AppDispatch) => {
    try {
        await setDoc(doc(getFirestore(), "users", uid), { username, email });
    } catch (e) {
        console.log(e);
    }
}