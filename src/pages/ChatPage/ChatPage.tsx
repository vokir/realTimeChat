import { getAuth, signOut } from 'firebase/auth'
import React, { FC } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import ChatList from '../../components/ChatList/ChatList'
import Button from '../../components/ui/Button/Button'
import UserSearch from '../../components/UserSearch/UserSearch'
import { useAppDispatch } from '../../hooks/reduxHooks'

import { removeUser } from '../../store/slices/UserSlice'
import './ChatPage.scss'

const Chat: FC = () => {
    const auth = getAuth()
    const dispatch = useAppDispatch()
    const params = useParams()

    const logout = () => {
        setTimeout(() => {
            signOut(auth)
            dispatch(removeUser())
        }, 1000)
    }
    return (
        <div className='container chat__container'>
            <div className="chat__header">
                <NavLink to={'/'}>Типо хедер</NavLink>
                <Button onClick={() => logout()} type={'submit'} >выйти</Button>
            </div>
            <div className="left-side">
                <UserSearch />
                <ChatList />
            </div>
            <div className="right-side">
                {params.id ?
                    <Outlet />
                    :
                    <div className="no-chat">
                        Выберите чат
                        или создайте новую беседу
                    </div>
                }
            </div>
        </div>
    )
}

export default Chat