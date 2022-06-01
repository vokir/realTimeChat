import React, { FC, useEffect, useRef, useState } from 'react'
import Button from '../ui/Button/Button'
import Input from '../ui/Input/Input'
import Message from './Message/Message'
import './Messages.scss'
import { MessagesType, setMessages, setMessage } from '../../store/slices/ChatSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { useNavigate, useParams } from 'react-router-dom'
import { saveMessage } from '../../store/actionCreators/chatCreator'
import { collection, DocumentData, getDocs, getFirestore, limit, onSnapshot, orderBy, query, startAfter } from 'firebase/firestore'
import { useInfinite } from '../../hooks/useInfinitePagination'

const Messages: FC = () => {
    const dispatch = useAppDispatch()
    const params = useParams()
    const navigate = useNavigate()
    const messageBlock: React.RefObject<HTMLDivElement> = useRef(null)
    const hidden: React.RefObject<HTMLDivElement> = useRef(null)
    const messages: MessagesType[] = useAppSelector(state => state.chat.messages)
    const [message, setMessageValue] = useState<string>('')
    const [lastVisible, setLastVisible] = useState<DocumentData>([])
    const [loading, setLoading] = useState<boolean>(true)

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
        dispatch(setMessages(messages.reverse()))
    }

    const exitChat = (e: KeyboardEvent) => {
        if (e.key === "Escape") navigate('/chat')
    }

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (message && params.id) {
            dispatch(saveMessage({ groupID: params.id, message }))
            setMessageValue('')
        }
    }

    const scrollToEnd = (behavior: boolean = true) => {

        if (messageBlock.current) {
            messageBlock.current.scrollTo({
                behavior: behavior ? "smooth" : "auto",
                top: messageBlock.current.scrollHeight
            })
        }

    }

    useEffect(() => {
        if (params.id) {
            const unsub = onSnapshot(query(collection(getFirestore(), "message", params.id, "messages"), orderBy('sentAt', 'desc'), limit(10)), (doc) => {
                let messages: MessagesType[] = []
                let docs: DocumentData[] = []

                if (!doc.metadata.hasPendingWrites) {
                    doc.docChanges().forEach((change) => {
                        if (change.type === "added" || change.type === 'modified') {
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
                    if (messages.length === 1) {
                        dispatch(setMessage(messages))
                    } else {
                        setLastVisible(docs[docs.length - 1])
                        dispatch(setMessages(messages.reverse()))
                    }
                    setTimeout(() => setLoading(false), 500)
                }
            })
            return () => {
                setLoading(true)
                unsub()
            }
        }
    }, [params.id])

    useEffect(() => {
        scrollToEnd(false)
    }, [loading])

    useEffect(() => {
        if (!loading) {
            scrollToEnd()
        }
    }, [messages])

    useEffect(() => {
        document.body.addEventListener('keyup', exitChat)
        return () => {
            document.body.removeEventListener('keyup', exitChat)
        }
    }, [])

    if (loading) return <div className='no-chat'>Загрузка ваших сообщений...</div>

    return (
        <section className="messages">
            {messages.length
                ?
                <div ref={messageBlock} className="messages__container">
                    {messages.map((message, index) => <Message {...message} key={index} />)}
                </div>
                :
                <div className='no-chat'>Сообщений ещё нет, напишите первым</div>
            }
            <form className="messages__input" onSubmit={(e: React.FormEvent<HTMLFormElement>) => sendMessage(e)}>
                <Input label='Отправить сообщение' name='message' value={message} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessageValue(e.target.value)} />
                <Button type='submit'>Отправить</Button>
            </form>
        </section>
    )
}

export default Messages
