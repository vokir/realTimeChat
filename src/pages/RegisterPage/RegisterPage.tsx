import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import React, { FC, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { setUser } from '../../store/slices/UserSlice'
import './RegisterPage.scss'
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";

const Register: FC = () => {
    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const push = useNavigate()

    const dispatch = useAppDispatch()

    const addUserInFireStore = (user: any) => {
        const database = getFirestore();
        setDoc(doc(database, "users", user.uid), {
            username: name,
            email: email,
        });
    }

    const register = () => {
        const auth = getAuth();
        setLoading(true)
        setTimeout(() => {
            createUserWithEmailAndPassword(auth, email, pass)
                .then(({ user }) => {
                    dispatch(setUser({
                        email,
                        username: name,
                        id: user.uid,
                    }))
                    addUserInFireStore(user)
                    push('/chat')
                })
                .catch(error => alert(error))
            setLoading(false)
        }, 1000)
    }

    return (
        <div className='login__container container'>
            <Input type="text" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} label='Имя' name='name' />
            <Input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} label='E-mail' name='email' />
            <Input type="password" value={pass} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value)} label='Пароль' name='pass' />
            <Button loading={loading} onClick={register}>Зарегистрироваться</Button>
            <NavLink className="link" to={'/login'}>войти</NavLink>
        </div>
    )
}

export default Register