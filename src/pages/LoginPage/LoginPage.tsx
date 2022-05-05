import React, { FC, useState } from 'react'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { setUser } from '../../store/slices/UserSlice'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import './LoginPage.scss'


const Login: FC = () => {

    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const push = useNavigate()

    const dispatch = useAppDispatch()

    const login = () => {
        const auth = getAuth();
        setLoading(true)
        setTimeout(() => {
            signInWithEmailAndPassword(auth, email, pass)
                .then((response) => {
                    dispatch(setUser({
                        email: response.user.email,
                        id: response.user.uid,
                    }))
                    push('/chat')
                })
                .catch(error => alert(error))
            setLoading(false)
        }, 1000)

    }

    return (
        <div className='register__container container'>
            <Input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} label='E-mail' name='email' />
            <Input type="password" value={pass} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value)} label='Пароль' name='pass' />
            <Button loading={loading} onClick={login}>Войти</Button>
            <NavLink className="link" to={'/register'}>зарегистрироваться</NavLink>
        </div>
    )
}

export default Login