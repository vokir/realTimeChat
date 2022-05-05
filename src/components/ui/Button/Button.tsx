import React, { FC } from 'react'
import { NavLink } from 'react-router-dom'
import { IButtonProps } from './type'
import './Button.scss'

const Button: FC<IButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    classes,
    href,
    children,
    disabled,
    loading,
    ...attrs
}) => {

    let computedClasses = 'btn'

    if (disabled) computedClasses += ' btn--disabled'
    if (loading) computedClasses += ' btn--loading'
    if (classes) computedClasses += ' ' + classes

    if (href) {
        return (
            <NavLink {...(attrs as React.AnchorHTMLAttributes<HTMLAnchorElement>)} to={href} className={computedClasses}>
                {children}
            </NavLink>
        );
    }

    return (
        <button type={'button'} {...(attrs as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={computedClasses} disabled={disabled}>
            {loading
                ?
                <div className="btn__loader">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                :
                children
            }
        </button>
    );
}

export default Button