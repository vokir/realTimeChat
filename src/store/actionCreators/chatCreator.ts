import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { GroupType, MessagesType, setGroups, setMessages } from "../slices/ChatSlice";

export const saveMessage = createAsyncThunk(
    'chat/saveMessage',
    async (data: { groupID: string, message: string }, thunkApi) => {
        const { groupID, message } = data
        try {
            const db = getFirestore();
            let state: any = thunkApi.getState()

            await addDoc(collection(db, "message", groupID, "messages"), {
                messageText: message,
                sentAt: serverTimestamp(),
                sentBy: state.user.uid
            });
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)
export const addNewGroupToUser = createAsyncThunk(
    'chat/addNewGroupToUser',
    async (data: { uid: string | undefined, groupID: any }, thunkApi) => {
        const { uid, groupID } = data
        try {
            const db = getFirestore();
            await getDoc(doc(db, `users/${uid}`)).then(docData => {
                let data = docData.data()
                if (data) {
                    data.groups ? data.groups.push(groupID) : data.groups = [groupID]
                }
                setDoc(doc(db, `users/${uid}`), data, { merge: true })
            })
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)
export const createGroup = createAsyncThunk(
    'chat/createGroup',
    async (data: { uid: string, usersArray: string[], groupName: string }, thunkApi) => {
        const { uid, usersArray, groupName } = data
        try {
            const db = getFirestore();
            await addDoc(collection(db, "groups"), {
                createdAt: serverTimestamp(),
                createdBy: uid,
                members: usersArray,
                name: groupName
            }).then((res) => {
                thunkApi.dispatch(updateGroup({ path: res.path, groupID: res.id }))
                usersArray.forEach(user => {
                    thunkApi.dispatch(addNewGroupToUser({ uid: user, groupID: res.id }))
                })
            })
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)
export const updateGroup = createAsyncThunk(
    'chat/updateGroup',
    async (data: { path: any, groupID: string }, thunkApi) => {
        const { path, groupID } = data
        try {
            const db = getFirestore();
            await setDoc(doc(db, path), {
                id: groupID
            }, { merge: true })
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)
export const fetchGroupsById = createAsyncThunk(
    'chat/fetchGroupsById',
    async (uid: string, thunkApi) => {
        try {
            const db = getFirestore();
            return onSnapshot(query(collection(db, 'groups'), where('members', 'array-contains', uid)), (doc) => {
                let array: GroupType[] = []
                doc.forEach(group => {
                    if (group) {
                        array.push({
                            id: group.data().id,
                            createdAt: group.data()?.createdAt?.toDate()?.toDateString(),
                            createdBy: group.data().createdBy,
                            members: group.data().members,
                            name: group.data().name
                        })
                    }
                })
                if (array.length) thunkApi.dispatch(setGroups(array))
            })
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)

export const fetchMessagesById = createAsyncThunk(
    'chat/fetchMessagesByID',
    async (group: string, thunkApi) => {
        try {
            const db = getFirestore();
            return onSnapshot(query(collection(db, "message", group, "messages"), orderBy('sentAt', 'asc')), (doc) => {
                let messages: MessagesType[] = []
                doc.forEach(message => {
                    if (message) {
                        messages.push({
                            messageText: message.data().messageText,
                            sentAt: message.data()?.sentAt?.toDate()?.toDateString(),
                            sentBy: message.data().sentBy,
                        })
                    }
                })
                if (messages.length) thunkApi.dispatch(setMessages(messages))
            })
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)

