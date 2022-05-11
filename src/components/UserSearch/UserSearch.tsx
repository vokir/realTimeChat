import React, { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { createGroup } from '../../store/actionCreators/chatCreator';
import { fetchUsers } from '../../store/actionCreators/userCreator';
import { UsersType } from '../../store/slices/UserSlice';
import Button from '../ui/Button/Button';
import Input from '../ui/Input/Input'
import './UserSearch.scss'

const getFilteredItems = (query: string, items: UsersType[]) => {
    if (!query) {
        return items;
    }

    return items.filter(item => item.username.includes(query));
}

const UserSearch = () => {
    const [state, setState] = useState<{
        uid: string,
        username: string,
        query: string,
    }>({
        uid: '',
        username: '',
        query: '',
    })

    const [active, setActive] = useState<boolean>(false)
    const users: UsersType[] = useAppSelector(state => state.user.users)
    const usersID: string = useAppSelector(state => state.user.uid)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchUsers())
    }, [])

    const computedUsers = useMemo(() => getFilteredItems(state.query, users), [state.query, users])

    const createChat = () => {

        if (!state.uid.length || !state.username.length) return

        dispatch(createGroup({
            groupName: state.username,
            uid: state.uid,
            usersArray: [
                state.uid,
                usersID
            ],
        }))
        setState({
            uid: '',
            username: '',
            query: '',
        })
    }

    return (
        <>
            <div className="user-search">
                <Input
                    label='Поиск пользователей'
                    name='search'
                    value={state.query}
                    onBlur={() => setTimeout(() => setActive(false), 100)}
                    onFocus={() => setActive(true)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, query: e.target.value })}
                />
                {active &&
                    <div className='users-list'>
                        {computedUsers.map(e =>
                            <div
                                className='users-list__item'
                                onClick={() => setState({
                                    query: e.username,
                                    uid: e.uid,
                                    username: e.username
                                })}
                                key={e.username}
                            >
                                {e.username}
                            </div>)
                        }
                    </div>
                }
            </div>
            {state.query !== '' && <Button onClick={() => createChat()}>Создать чат</Button>}
        </>
    )
}

export default UserSearch