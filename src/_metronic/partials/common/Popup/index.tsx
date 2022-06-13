import React, { useRef, useEffect, useState } from "react";
import './style.scss'
/**
 * Hook that alerts clicks outside of the passed ref
 */
interface PropsInterface {
    children: React.ReactNode
}
const PopupComponent = (props: PropsInterface) => {
    const { children } = props

    return <div className={`main-popup`}>
        <div className="popup-wrapper">
            {children}
        </div>
    </div>;
}

export default PopupComponent;
