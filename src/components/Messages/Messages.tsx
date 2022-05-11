import React, { FC, useEffect, useRef, useState } from 'react'
import Button from '../ui/Button/Button'
import Input from '../ui/Input/Input'
import Message from './Message/Message'
import './Messages.scss'
import { MessagesType } from '../../store/slices/ChatSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { useParams } from 'react-router-dom'
import { fetchMessagesById, saveMessage } from '../../store/actionCreators/chatCreator'

const Messages: FC = () => {
    const dispatch = useAppDispatch()
    const params = useParams()

    const messageBlock: React.RefObject<HTMLInputElement> = useRef(null)

    useEffect(() => {
        let unsub: unknown
        if (params.id) {
            dispatch(fetchMessagesById(params.id))
                .then(resonse => {
                    if (resonse.meta.requestStatus === 'fulfilled') {
                        unsub = resonse.payload
                    }
                })
        }
        return () => {
            if (typeof (unsub) === 'function') unsub()
        }
    }, [params.id])

    const messages: MessagesType[] = useAppSelector(state => state.chat.messages)

    const [message, setMessage] = useState<string>('')

    const sendMessage = () => {
        if (message && params.id) {
            dispatch(saveMessage({ groupID: params.id, message }))
            setMessage('')
        }
    }

    useEffect(() => {
        scrollToEnd()
    }, [messages])

    const scrollToEnd = () => {
        if (messageBlock.current) {
            messageBlock.current.scrollTo({
                behavior: 'smooth',
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
                <Input label='Отправить сообщение' name='message' value={message} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)} />
                <Button onClick={() => sendMessage()}>Отправить</Button>
            </div>
        </section>
    )
}

export default Messages