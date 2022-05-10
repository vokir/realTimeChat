import React, { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { fetchGroupsById } from '../../store/actionCreators/chatCreator'
import { GroupType } from '../../store/slices/ChatSlice'
import './ChatList.scss'
import ListElement from './ListElement/ListElement'

const ChatList: FC = () => {
    const userID: string = useAppSelector(state => state.user.uid)
    const groups: GroupType[] = useAppSelector(state => state.chat.groups)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (userID) {
            dispatch(fetchGroupsById(userID))
        }
    }, [userID])

    return (
        <div className="chat-list">
            <b>Список чатов</b>
            {groups && groups.map((group, index) => <ListElement {...group} key={index} />)}
        </div>
    )
}

export default ChatList