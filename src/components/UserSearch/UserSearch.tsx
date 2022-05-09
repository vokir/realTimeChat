import React, { useMemo, useState } from 'react'
import Button from '../ui/Button/Button';
import Input from '../ui/Input/Input'

const getFilteredItems = (query: string, items: Array<{ name: string }>) => {
    if (!query) {
        return items;
    }

    return items.filter(item => item.name.includes(query));
}

const UserSearch = () => {
    const [query, setQuery] = useState<string>('')
    const users: Array<{ name: string }> = [
        { name: 'bob' },
        { name: 'jack' },
        { name: 'billy' }
    ]

    const computedUsers = useMemo(() => getFilteredItems(query, users), [query])


    return (
        <div className="user-search">
            <Input label='Поиск пользователей' name='search' value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} />
            {!query && computedUsers.map(e => <div onClick={() => setQuery(e.name)} key={e.name}>{e.name}</div>)}
        </div>
    )
}

export default UserSearch   