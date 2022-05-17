import React, { FC, useEffect, useRef, useState } from 'react'
import Button from '../ui/Button/Button'
import Input from '../ui/Input/Input'
import Message from './Message/Message'
import './Messages.scss'
import { MessagesType, setMessages, setMessage } from '../../store/slices/ChatSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { useParams } from 'react-router-dom'
import { saveMessage } from '../../store/actionCreators/chatCreator'
import { collection, DocumentData, getDocs, getFirestore, limit, onSnapshot, orderBy, query, startAfter } from 'firebase/firestore'

const Messages: FC = () => {
    const dispatch = useAppDispatch()
    const params = useParams()
    const messageBlock: React.RefObject<HTMLInputElement> = useRef(null)
    const childRef: React.RefObject<HTMLInputElement> = useRef(null)
    const messages: MessagesType[] = useAppSelector(state => state.chat.messages)
    const [message, setMessageValue] = useState<string>('')
    const [lastVisible, setLastVisible] = useState<DocumentData>([])

    const fetchMessages = async (id: string) => {
        let messages: MessagesType[] = []
        const next = query(collection(getFirestore(), "message", id, "messages"),
            orderBy('sentAt', 'desc'),
            startAfter(lastVisible),
            limit(10));
        const documentSnapshots = await getDocs(next);

        documentSnapshots.forEach(doc => {
            messages.push({
                messageText: doc.data().messageText,
                sentAt: doc.data()?.sentAt?.toDate()?.toDateString(),
                sentBy: doc.data().sentBy,
            })
        });
        dispatch(setMessage(messages.reverse()))
    }


    // useEffect(() => {
    //     if (params.id) {
    //         fetchMessages(params.id)
    //     }
    // }, [lastVisible])
    useEffect(() => {
        if (params.id) {

            const unsub = onSnapshot(query(collection(getFirestore(), "message", params.id, "messages"), orderBy('sentAt', 'desc'), limit(10)), (doc) => {
                let messages: MessagesType[] = []
                let docs: DocumentData[] = []

                doc.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        if (change.doc) {
                            messages.push({
                                messageText: change.doc.data().messageText,
                                sentAt: change.doc.data()?.sentAt?.toDate()?.toDateString(),
                                sentBy: change.doc.data().sentBy,
                            })
                            docs.push(change.doc)
                        }
                    }
                })

                if (messages.length > 1) {
                    setLastVisible(docs[docs.length - 1])
                    dispatch(setMessages(messages.reverse()))
                } else {
                    dispatch(setMessage(messages))
                }
                scrollToEnd(false)
            })
            return () => {
                unsub()
            }
        }
    }, [params.id])

    const sendMessage = () => {
        if (message && params.id) {
            dispatch(saveMessage({ groupID: params.id, message }))
            setMessageValue('')
            scrollToEnd()
        }
    }

    const scrollToEnd = (behavior: boolean = true) => {
        if (messageBlock.current) {
            messageBlock.current.scrollTo({
                behavior: behavior ? "smooth" : "auto",
                top: messageBlock.current.scrollHeight + 15
            })
        }

    }

    return (
        <section className="messages">
            <div ref={messageBlock} className="messages__container">
                {messages.map((message, index) => <Message {...message} key={index} />)}
            </div>
            <div className="messages__input">
                <Input label='Отправить сообщение' name='message' value={message} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessageValue(e.target.value)} />
                <Button type='submit' onClick={() => sendMessage()}>Отправить</Button>
            </div>
        </section>
    )
}

export default Messages