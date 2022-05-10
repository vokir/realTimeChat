import React, { FC, useEffect, useState } from 'react'
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

    useEffect(() => {
        if (params.id) {
            dispatch(fetchMessagesById(params.id))
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

    return (
        <section className="messages">
            <div className="messages__container">
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