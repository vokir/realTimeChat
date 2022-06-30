import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { createGroup } from '../../store/actionCreators/chatCreator';
import { fetchUsers } from '../../store/actionCreators/userCreator';
import { UsersType } from '../../store/slices/UserSlice';
import Button from '../ui/Button/Button';
// import Select from '../ui/Select/Select';
import './UserSearch.scss'
import Multiselect from 'multiselect-react-dropdown';
import Input from '../ui/Input/Input';

const UserSearch = () => {

    const [selected, setSelected] = useState<string[]>([])
    const [chatName, setchatName] = useState<string>('')

    const users: UsersType[] = useAppSelector(state => state.user.users)
    const usersID: string = useAppSelector(state => state.user.uid)
    const navigate = useNavigate()

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchUsers())
    }, [])

    const createChat = () => {
        
        if (!selected.length) return

        dispatch(createGroup({
            groupName: chatName,
            uid: usersID,
            usersArray: [...selected, usersID],
        })).then(res => {
            if (typeof res.payload === "string") {
                navigate('/chat/' + res.payload)
            }
        })
        setSelected([])
        setchatName('')
    }

    const onSelect = (selectedList:UsersType[], selectedItem: UsersType) => {
        setSelected([...selected, selectedItem.uid])
    }
    const onRemove = (selectedList:UsersType[], removedItem: UsersType) => {
        setSelected(selected.filter(t => t !== removedItem.uid))
    }

    return (
        <div className="user-search">
            <Multiselect
                className='user-select'
                options={users}
                hidePlaceholder
                displayValue="username"
                placeholder={'Пользователи'}
                onSelect={onSelect}
                onRemove={onRemove}
            />
            <Input
                classes='input-group'
                label='Название чата' 
                name='message' 
                value={chatName} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setchatName(e.target.value)} 
            />
            {/* <Select
                classes='user-select'
                value={selectValue}
                onChange={(value) => setSelectValue(value)}
                onSelect={(value) => setSelected({ ...value })}
                options={users}
                label="username"
            /> */}
            {Boolean(selected.length) && <Button onClick={() => createChat()}>Создать чат</Button>}
        </div>
    )
}

export default UserSearch
