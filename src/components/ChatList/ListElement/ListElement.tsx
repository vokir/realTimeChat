import React, { FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GroupType } from '../../../store/slices/ChatSlice'
import './ListElement.scss'

const ListElement: FC<GroupType> = ({ id, name }) => {
    const navigate = useNavigate()
    const params = useParams()

    const openChat = () => {
        navigate('/chat/' + id)
    }

    return (
        <div className={params.id === id ? 'chat-list__item chat-list__item--active' : 'chat-list__item'} onClick={() => openChat()}>{name}</div>
    )
}

export default ListElement
