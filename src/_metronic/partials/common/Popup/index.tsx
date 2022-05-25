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

    // const useOutsideDetection = (ref: any) => {
    //     useEffect(() => {
    //         const handleClickOutside = (event: any) => {
    //             if (!ref.current.contains(event.target)) {
    //                 console.log(event.path)
    //                 setIsClosePopup(prev => !prev);
    //             }
    //         }
    //         document.addEventListener("mousedown", handleClickOutside);
    //         return () => document.removeEventListener("mousedown", handleClickOutside)
    //     }, [ref]);
    // }



    const wrapperRef = useRef(null);
    // useOutsideDetection(wrapperRef);
    return <div  className={`main-popup ${isClosePopup ? 'd-none' : ''}`}>
        <div ref={wrapperRef} className="popup-wrapper">
            {children}
        </div>
    </div>;
}

export default PopupComponent;