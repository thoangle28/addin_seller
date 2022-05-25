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
    const [isClosePopup, setIsClosePopup] = useState(false)

    const useOutsideDetection = (ref: any) => {
        useEffect(() => {
            function handleClickOutside(event: any) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setIsClosePopup(prev => !prev);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }



    const wrapperRef = useRef(null);
    useOutsideDetection(wrapperRef);
    return <div ref={wrapperRef} className={`main-popup ${isClosePopup ? 'd-none' : ''}`}>
        <div className="popup-wrapper">
            {children}
        </div>
    </div>;
}

export default PopupComponent;