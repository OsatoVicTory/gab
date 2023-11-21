import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader = ({ circle, width, height }) => {
    return (
        <Skeleton circle={circle||false} width={width||'100%'} 
        height={height} colorStart={'#E0E0E0'} colorEnd={'#C0C0C0'} />
    )
};

export default SkeletonLoader;