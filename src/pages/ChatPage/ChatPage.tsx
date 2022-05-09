import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import React, { FC, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import ChatList from '../../components/ChatList/ChatList'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { addNewGroupToUser, createGroup, fetchGroupsById } from '../../store/actionCreators/chatCreator'
import { fetchUsers } from '../../store/actionCreators/userCreator'
import { removeUser } from '../../store/slices/UserSlice'
import './ChatPage.scss'
const Chat: FC = () => {
    const auth = getAuth()
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const user = useAppSelector(state => state.user)
    const groups = useAppSelector(state => state.chat.groups)

    const [isLoading, setLoading] = useState(false)
    const [selectedUser, setSelectedUser] = useState('')
    const [selectedChat, setSelectedChat] = useState('')
    const [name, setName] = useState('')

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            dispatch(fetchUsers()).then(() => {
                setLoading(false)
            })
            dispatch(fetchGroupsById())
        }, 1000)
    }, [])

    const logout = () => {
        setTimeout(() => {
            auth.signOut()
            dispatch(removeUser())
        }, 1000)
    }
    const select = (value: string) => {
        setSelectedUser(value)
    }
    const startChat = () => {
        if (name === '') return
        dispatch(createGroup({
            uid: user.uid,
            usersArray: [user.uid, selectedUser],
            groupName: name
        })).then(response => {

            let groupID = response.payload

            dispatch(addNewGroupToUser({ uid: user.uid, groupID }))
            dispatch(addNewGroupToUser({ uid: selectedUser, groupID }))
        })
        setSelectedUser('')
    }
    return (
        <div className='container chat__container'>
            <div className="left-side">
                <Button onClick={() => logout()} classes='biba boba' type={'submit'} >выйти</Button>
                <h4>Список пользователей</h4>
                {isLoading ?
                    'загрузка...'
                    :
                    <>
                        <ChatList selected={selectedUser} func={select} items={user.users} />
                        <Input name='chatName' label='Название чата' type="text" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                        <br></br>
                        <Button onClick={() => startChat()}>создать чат</Button>
                    </>
                }
                <h4>Список чатов</h4>
                {isLoading ?
                    'загрузка...'
                    :
                    <ul className='chat-list'>
                        {groups?.map(item =>
                            <li onClick={() => {
                                navigate('/chat/' + item.id);
                                setSelectedChat(item.id)
                            }} className={selectedChat === item.id ? 'chat-list__item chat-list__item--active' : 'chat-list__item'} key={item.id}>
                                <span className='chat-list__name'>{item.name}</span>
                            </li>
                        )}
                    </ul>

                }
            </div>
            <div className="right-side">
                <Outlet />
            </div>
        </div>
    )
}

export default Chat