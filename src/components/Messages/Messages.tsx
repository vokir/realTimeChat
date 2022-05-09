import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { addNewGroupToUser, createGroup, fetchGroupsById, fetchMessagesById, saveMessage, updateGroup } from '../../store/actionCreators/chatCreator';
import Button from '../ui/Button/Button';
import Input from '../ui/Input/Input';

const Messages = () => {
    const messages = useAppSelector(state => state.chat.messages)

    const [message, setMessage] = useState<string>('')
    const userID = useAppSelector(state => state.user.uid)
    let params = useParams();
    const dispatch = useAppDispatch()

    const database = getFirestore();
    const test = () => {
        dispatch(createGroup({
            uid: userID,
            usersArray: [userID, params.id],
            groupName: 'test'
        })).then(response => {

            let groupID = response.payload

            dispatch(addNewGroupToUser({ uid: userID, groupID }))
            dispatch(addNewGroupToUser({ uid: params.id, groupID }))
            dispatch(saveMessage({ message, groupID }))
        })

    }
    const getMessages = async (group: any) => {
        // const unsub = onSnapshot(query(collection(database, "message", group, "messages"), orderBy('sentAt', 'asc')), (doc) => {
        //     let data: any[] = []
        //     doc.forEach(item => {
        //         data.push(item.data())
        //     })
        //     setMessages(data)
        // })
        dispatch(fetchMessagesById(group))
    }

    useEffect(() => {
        getMessages(params.id)
    }, [params.id])

    return (
        <div>
            {messages && messages.map((message, index) => <div key={index}>{message.messageText}</div>)}
            <br />
            <br />
            {params.id}
            <br />
            <br />
            <Input type="text" value={message} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)} label='Сообщение' name='message' />
            <Button onClick={() => dispatch(saveMessage({ message, groupID: params.id }))}>Отправить</Button>
        </div>
    )
}

export default Messages