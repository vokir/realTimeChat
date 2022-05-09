import { createAsyncThunk } from "@reduxjs/toolkit";
import { rejects } from "assert";
import { addDoc, collection, doc, DocumentData, getDoc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { resolve } from "path";
import { setGroups, setMessages } from "../slices/ChatSlice";

export const saveMessage = createAsyncThunk(
    'chat/saveMessage',
    async (data: { groupID: any, message: string }, thunkApi) => {
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
    async (data: { uid: string | undefined, usersArray: any[], groupName: string }, thunkApi) => {
        const { uid, usersArray, groupName } = data
        try {
            let groupID = undefined
            const db = getFirestore();
            await addDoc(collection(db, "groups"), {
                createdAt: serverTimestamp(),
                createdBy: uid,
                members: usersArray,
                name: groupName
            }).then((res) => {
                thunkApi.dispatch(updateGroup({ path: res.path, groupID: res.id }))
                groupID = res.id
            })
            return groupID
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
    async (_, thunkApi) => {
        try {
            const state: any = thunkApi.getState()
            const db = getFirestore();
            let array: DocumentData[] = []
            // const response = await getDoc(doc(db, `users/${state.user.uid}`))
            // return response.data()
            onSnapshot(query(collection(db, 'groups'), where('members', 'array-contains', state.user.uid)), (doc) => {
                doc.forEach(group => {
                    if (group) {
                        array.push({
                            id: group.data().id,
                            createdAt: group.data().createdAt.toDate().toDateString(),
                            createdBy: group.data().createdBy,
                            members: group.data().members,
                            name: group.data().name
                        })
                    }
                })
                thunkApi.dispatch(setGroups({ groups: array }))
            })

        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)

export const fetchMessagesById = createAsyncThunk(
    'chat/fetchMessagesByID',
    async (group: any, thunkApi) => {
        try {
            const db = getFirestore();
            let array: DocumentData[] = []
            onSnapshot(query(collection(db, "message", group, "messages"), orderBy('sentAt', 'asc')), (doc) => {
                doc.forEach(message => {
                    if (message) {
                        array.push({
                            messageText: message.data().messageText,
                            sentAt: message.data().sentAt.toDate().toDateString(),
                            sentBy: message.data().sentBy,
                        })
                    }
                })
                thunkApi.dispatch(setMessages({ messages: array }))
            })


        } catch (e) {
            return thunkApi.rejectWithValue(e)

        }
    }
)

