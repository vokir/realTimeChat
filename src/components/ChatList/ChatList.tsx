import React, { FC } from 'react'
import './ChatList.scss'
import ListElement from './ListElement/ListElement'
import { IListElement } from './type'

const ChatList: FC = () => {

    const groups: IListElement[] = [
        {
            name: "boba chat",
            id: "XL7nkmDm2C2LrQZZfFGm",
        },
        {
            name: "boba chat2",
            id: "y7nP3tkcJFODcFB8k9jG",
        },
        {
            name: "boba chat2",
            id: "YFCmaV2klxq6G9fToIfG",
        },
    ]



    return (
        <div className="chat-list">
            <b>Список чатов</b>
            {groups.map(group => <ListElement {...group} key={group.id} />)}
        </div>
    )
}

export default ChatList