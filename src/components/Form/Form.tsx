import React, { FC } from 'react'
import './Form.scss'

export interface IFormProps {
    children?: React.ReactNode,
}

const Form: FC<IFormProps & React.FormHTMLAttributes<HTMLFormElement>> = ({ children, ...props }) => {
    return (
        <div className="form-container">
            <form className="form" {...props}>
                {children}
            </form>
        </div>
    )
}

export default Form