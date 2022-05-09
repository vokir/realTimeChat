import React, { FC, useState } from 'react'
import Button from '../ui/Button/Button'
import Input from '../ui/Input/Input'
import Message from './Message/Message'
import { IMessageProps } from './type'
import './Messages.scss'

const Messages: FC = () => {
    const messages: IMessageProps[] = [
        {
            messageText: "Привет боба",
            sentAt: "May 9, 2022 at 10:29:16 AM UTC+5",
            sentBy: "rFNa3p451DbdEpqSdz5KR6ez3Vd2"
        },
        {
            messageText: "привет qwe",
            sentAt: "May 9, 2022 at 10:29:40 AM UTC+5",
            sentBy: "E9ya2XyAYOMjj7X8Rn0et1997NJ2"
        },
        {
            messageText: "qq",
            sentAt: "May 9, 2022 at 10:32:20 AM UTC+5",
            sentBy: "E9ya2XyAYOMjj7X8Rn0et1997NJ2"
        },

    ]
    const [message, setMessage] = useState<string>('')

    const sendMessage = () => {
        // ...
        setMessage('')
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