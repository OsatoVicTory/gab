import './content.css';
import TextWithEmoji from '../../TextWithEmoji';
import OptimizedImage from '../../OptimizedImage';
import { useSelector, useDispatch } from 'react-redux';
import { setStatusMessageData, setFixedStatusData } from '../../../store/actions';
import { bindActionCreators } from 'redux';

const StatusTagged = ({ quote, search }) => {

    const { mine, data } = useSelector(state => state.status);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const setFixedStatus = bindActionCreators(setFixedStatusData, dispatch);

    function openStatus() {
        if(quote.posterId === user._id) {
            for(let m = 0; m < mine.length; m++) {
                if(mine[m]._id === quote._id) {
                    return setFixedStatus({ 
                        type: 'status-view', index: m, 
                        view: mine, account: user 
                    });
                }
            }
            return setStatusMessage({type:'error', text:'Status not found'});
        }
        for(let st = 0; st < data.length; st++) {
            if(data[st].account._id === quote.posterId) {
                const { statuses } = data[st];
                for(let s = 0; s < statuses.length; s++) {
                    if(statuses[s]._id === quote._id) {
                        return setFixedStatus({ 
                            type: 'status-view', index: s, 
                            view: statuses, account: data[st].account 
                        });
                    } 
                }
                return setStatusMessage({type:'error', text:'Status not found'});
            }
        }
        return setStatusMessage({type:'error', text:'Status not found'});
    };

    return (
        <div className='Quote' onClick={openStatus}>
            <div className='thread st'></div>
            <div className='quote_top'>
                <span className='quote_sender st'>Status</span>
            </div>
            <div className='quote'>
                <div className={`quote__ ${quote.img ? 'withImage' : ''}`}>
                        
                    <div className='quote_message__'>
                        <TextWithEmoji font={12} search={search}
                        text={quote.text || quote.caption || 'Image'}
                        CLX={'quote_message'} clx={'quote_message-inner'} /> 
                    </div>

                    {quote.img && <div className='quote_img'>
                        <OptimizedImage data={quote} />
                    </div>}

                </div>
            </div>
        </div>
    )
};

export default StatusTagged;