import '../App.css';
import { BiError } from 'react-icons/bi';

const ErrorPage = ({ event, click }) => {

    const errorClick = () => {
        if(event) click();
        else window.location.reload();
    };
    
    return (
        <div className='Error__'>
            <BiError className='error-page-icon' />
            <h2 className='h2'>Error</h2>
            <div className='reload' onClick={errorClick}>Reload</div>
        </div>
    )
};

export default ErrorPage;