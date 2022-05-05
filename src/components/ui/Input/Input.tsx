import React, { FC } from 'react'
import './Input.scss'
import { IInputProps } from './type'

const Input: FC<IInputProps> = ({ label, name, classes, ...attrs }) => {

    let computedClasses = 'input-group__input'

    if (classes) computedClasses += ' ' + classes
    if (attrs.value !== '') computedClasses += ' input-group__input--active'

    return (
        <div className="input-group">
            <input className={computedClasses} name={name} id={name} {...attrs} />
            <span className="input-group__bar"></span>
            <label htmlFor={name} className="input-group__label">{label}</label>
        </div>
    )
}

export default Input