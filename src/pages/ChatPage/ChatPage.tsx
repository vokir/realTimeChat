import { getAuth } from 'firebase/auth'
import React, { FC, useEffect, useState } from 'react'
import Button from '../../components/ui/Button/Button'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { fetchUsers } from '../../store/actionCreators/userCreator'

const Chat: FC = () => {
    const auth = getAuth()

    const users = useAppSelector(state => state.user.users)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchUsers())
    }, [])

    const [isLoading, setLoading] = useState(false)

    const login = () => {
        setLoading(true)
        setTimeout(() => {
            auth.signOut()
            setLoading(false)
        }, 1000)
    }
    console.log(users);

    return (
        <div>
            <h4>Список пользователей</h4>
            <ul>
                {users?.map((e, index) =>
                    <li key={index}>
                        <div>{index}</div>
                        <div>{e.email}</div>
                    </li>
                )}
            </ul>
            {/* {loading ?
                'загрузка...'
                :
                <ul>
                    {users?.map(e => <li key={e.username}>
                        <div>{e.username}</div>
                        <div>{e.email}</div>
                    </li>)}
                </ul>
            } */}
            <Button onClick={() => login()} loading={isLoading} classes='biba boba' type={'submit'} >выйти</Button>
        </div>
    )
}

export default Chat