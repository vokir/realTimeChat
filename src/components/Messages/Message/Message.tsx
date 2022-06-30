import React, { FC } from 'react'
import { useAppSelector } from '../../../hooks/reduxHooks'
import './Message.scss'
import { MessagesType } from '../../../store/slices/ChatSlice'

const Message: FC<MessagesType> = ({ messageText, sentAt, sentBy, name }) => {
    const uid = useAppSelector(state => state.user.uid)

    return (
        <div className={sentBy === uid ? "message message--you" : "message"}>
            <div className="message__text">{messageText}</div>
            {sentBy !== uid && <div className="message__name">{name}</div>}
            <div className="message__date">{sentAt}</div>
        </div>
    )
}

export default Message