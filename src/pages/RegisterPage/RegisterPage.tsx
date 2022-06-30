import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth'
import React, { FC, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { setUser } from '../../store/slices/UserSlice'
import Form from '../../components/Form/Form'
import { addUser } from '../../store/actionCreators/userCreator'

const Register: FC = () => {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const push = useNavigate()
    const dispatch = useAppDispatch()

    const register = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const auth = getAuth();
        setLoading(true)
        setTimeout(() => {
            createUserWithEmailAndPassword(auth, email, pass)
                .then(({ user }) => {
                    updateProfile(user, {
                        displayName: name
                    }).then(() => {
                        dispatch(setUser({
                            email: user.email,
                            username: user.displayName,
                            uid: user.uid,
                        }))
                        dispatch(addUser(email, name, user.uid))
                        push('/chat')
                    })
                })
                .catch(error => console.log(error))
                .finally(() => setLoading(false))
        }, 1000)
    }

    return (
        <Form id="register" onSubmit={(e: React.FormEvent<HTMLFormElement>) => register(e)}>
            <Input type="text" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} label='Имя' name='name' />
            <Input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} label='E-mail' name='email' />
            <Input type="password" value={pass} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value)} label='Пароль' name='pass' />
            <Button type='submit' loading={loading}>Зарегистрироваться</Button>
            <NavLink className="link" to={'/login'}>войти</NavLink>
        </Form>
    )
}

export default Register