import { collection, DocumentData, getDocs, getFirestore } from "firebase/firestore";
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