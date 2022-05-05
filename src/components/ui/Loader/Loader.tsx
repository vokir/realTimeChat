import React, { FC } from 'react'
import './Loader.scss'

const Loader: FC = () => {
    return (
        <div className="loader-container">
            <div className="loader">
                <svg viewBox="0 0 86 80">
                    <polygon points="43 8 79 72 7 72"></polygon>
                </svg>
            </div>
        </div>
    )
}

export default Loader