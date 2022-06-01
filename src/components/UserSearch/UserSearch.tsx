import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { createGroup } from '../../store/actionCreators/chatCreator';
import { fetchUsers } from '../../store/actionCreators/userCreator';
import { UsersType } from '../../store/slices/UserSlice';
import Button from '../ui/Button/Button';
import Select from '../ui/Select/Select';
import './UserSearch.scss'

interface Selected {
    uid: string,
    username: string,
    email: string,
}

const UserSearch = () => {
    const [selected, setSelected] = useState<Selected>({
        uid: '',
        username: '',
        email: '',
    })
    const [selectValue, setSelectValue] = useState<string>('')

    const users: UsersType[] = useAppSelector(state => state.user.users)
    const usersID: string = useAppSelector(state => state.user.uid)
    const navigate = useNavigate()

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchUsers())
    }, [])

    const createChat = () => {

        if (!selected.uid.length || !selected.username.length) return

        dispatch(createGroup({
            groupName: selected.username,
            uid: selected.uid,
            usersArray: [
                selected.uid,
                usersID
            ],
        })).then(res => {
            if (typeof res.payload === "string") {
                navigate('/chat/' + res.payload)
            }
        })
        setSelected({
            uid: '',
            username: '',
            email: '',
        })
        setSelectValue('')
    }

    return (
        <div className="user-search">
            <Select
                classes='user-select'
                value={selectValue}
                onChange={(value) => setSelectValue(value)}
                onSelect={(value) => setSelected({ ...value })}
                options={users}
                label="username"
            />
            {selected.username !== '' && <Button onClick={() => createChat()}>Создать чат</Button>}
        </div>
    )
}

export default UserSearch
