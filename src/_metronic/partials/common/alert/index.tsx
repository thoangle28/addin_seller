import './style.scss'
interface IAlertProps {
    hasErrors: boolean;
    message: string;
}

const AlertMessage = ({ hasErrors, message }: IAlertProps) => {
    const alertClass = `${hasErrors ? 'mb-lg-15 alert alert-danger' : 'mb-lg-8 p-8 alert-success'}`

    return <div className={alertClass}>
        <div className='alert-text font-weight-bold'>
            <p className='upper-st-letter text-default text-center mb-0'>{message}</p>
        </div>
    </div>
}

export default AlertMessage