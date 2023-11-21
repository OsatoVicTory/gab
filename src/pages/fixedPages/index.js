import {
    setFixedImagesData, setFixedStatusData 
} from "../../store/actions";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import FixedImages from "./Images";
import StatusPage from "./Status";

const FixedPage = ({ data, socket }) => {
    const dispatch = useDispatch();
    const setFixedImages = bindActionCreators(setFixedImagesData, dispatch);
    const setFixedStatus = bindActionCreators(setFixedStatusData, dispatch);

    const closePage = () => {
        if(data.type === 'image') setFixedImages(null);
        else setFixedStatus(null);
    }

    if(data.type === 'image') {
        return <FixedImages data={data} closePage={closePage} />
    } else if(data.type === 'status-view') {
        return <StatusPage data={data} closePage={closePage} socket={socket} /> 
    } 

}

export default FixedPage;