import {
    setFixedImagesData, setFixedStatusData, setFixedCallsData 
} from "../../store/actions";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import FixedImages from "./Images";
import StatusPage from "./Status";
// import CallsPage from "./Calls";

const FixedPage = ({ data, socket }) => {
    const dispatch = useDispatch();
    const setFixedImages = bindActionCreators(setFixedImagesData, dispatch);
    const setFixedStatus = bindActionCreators(setFixedStatusData, dispatch);
    const setFixedCalls = bindActionCreators(setFixedCallsData, dispatch);

    const closePage = () => {
        if(data.type === 'image') setFixedImages(null);
        else if(data.type === 'status-view') setFixedStatus(null);
        else setFixedCalls(null);
    }

    if(data.type === 'image') {
        return <FixedImages data={data} closePage={closePage} />
    } else if(data.type === 'status-view') {
        return <StatusPage data={data} closePage={closePage} socket={socket} /> 
    } 
    // else if(data.type === 'audio' || data.type === 'video') {
    //     return <CallsPage data={data} closePage={closePage} socket={socket} />
    // }

}

export default FixedPage;