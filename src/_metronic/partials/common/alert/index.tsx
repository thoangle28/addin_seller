import './style.scss'
interface IAlertProps {
    alertClass: string;
    message: string;
}

const AlertMessage = ({ alertClass, message }: IAlertProps) => {
    return <div className={alertClass}>
        <div className='alert-text font-weight-bold'>
            <p className='upper-st-letter text-default text-center mb-0'>{message}</p>
        </div>
    </div>
}

export default AlertMessage