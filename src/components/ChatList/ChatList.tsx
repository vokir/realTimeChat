import React, { FC } from 'react'
import ChatListItem from './ChatListItem/ChatListItem'
import './ChatList.scss'

interface IChatList {
    items: Array<{
        username: string,
        email: string,
        uid: string
    }> | undefined,
    func: (value: string) => void,
    selected: string
}
const ChatList: FC<IChatList> = ({ items, func, selected }) => {
    return (
        <ul className='chat-list'>
            {items?.map(item =>
                <ChatListItem selected={selected} func={() => func(item.uid)} item={item} key={item.uid} />
            )}
        </ul>
    )
}

export default ChatList