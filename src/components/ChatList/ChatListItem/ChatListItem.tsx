import React, { FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

interface IChatListItem {
    item: {
        username: string,
        uid: string
    },
    func?: () => void,
    selected: string
}

const ChatListItem: FC<IChatListItem> = ({ item, func, selected }) => {
    const navigate = useNavigate();


    let computedStyle = 'chat-list__item'

    if (item.uid === selected) computedStyle += ' chat-list__item--active'

    return (
        <div className={computedStyle} onClick={func}>
            <span className='chat-list__name'>{item.username}</span>
        </div>
    )
}

export default ChatListItem