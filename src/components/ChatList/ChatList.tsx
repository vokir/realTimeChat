import { collection, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import React, { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { GroupType, setGroups } from '../../store/slices/ChatSlice'
import './ChatList.scss'
import ListElement from './ListElement/ListElement'

const ChatList: FC = () => {
    const userID: string = useAppSelector(state => state.user.uid)
    const groups: GroupType[] = useAppSelector(state => state.chat.groups)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (userID) {
            const unsub = onSnapshot(query(collection(getFirestore(), 'groups'), where('members', 'array-contains', userID)), (doc) => {
                let groups: GroupType[] = []
                doc.forEach(group => {
                    if (group) {
                        groups.push({
                            id: group.data().id,
                            createdAt: group.data()?.createdAt?.toDate()?.toDateString(),
                            createdBy: group.data().createdBy,
                            members: group.data().members,
                            name: group.data().name
                        })
                    }
                })
                groups.sort((a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    return 0;
                })
                dispatch(setGroups(groups))
            })

            return () => {
                unsub()
            }
        }
    }, [userID])

    return (
        <div className="chat-list">
            <b>{groups.length ? "Список чатов" : "У вас ещё нет чатов"}</b>
            {Boolean(groups.length) && groups.map((group, index) => <ListElement {...group} key={index} />)}
        </div>
    )
}

export default ChatList
