import { HiMiniEllipsisVertical } from "react-icons/hi2";
import { TbCircleDashed } from "react-icons/tb";
import { 
    MdOutlineSearch, MdKeyboardArrowDown, MdOutlineAlternateEmail,
    MdCheckBox, MdCheckBoxOutlineBlank, MdSend, MdVideocam, MdOutlineMessage
} from "react-icons/md";
import { AiOutlineArrowLeft, AiOutlineClose, AiFillPlusCircle } from 'react-icons/ai';
import { 
    BsCameraFill, BsPinAngleFill, BsEmojiSmileFill, BsEmojiSmile,
    BsCheck2All, BsCheck2, BsFillTelephoneFill 
} from 'react-icons/bs';
import { BiLinkAlt, BiSolidMicrophone } from 'react-icons/bi';

export const Ellipsis = ({ className }) => <HiMiniEllipsisVertical className={className} />;
export const Status = ({ className, newUpdates }) => {
    return (
        // <TbCicleDashed className={className}>
        //     <div className='inner-tb-circle'></div>
        // </TbCicleDashed>
        <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className={className} fill="none">
            <path fillRule="evenodd" clipRule="evenodd" 
            d="M3.71672 8.34119C3.23926 8.06362 3.07722 7.45154 3.35479 6.97407C4.33646 5.28548 5.79114 3.92134 7.53925 3.05006C9.28736 2.17878 11.2524 1.83851 13.1916 2.07126C13.74 2.13707 14.1312 2.63494 14.0654 3.18329C13.9995 3.73164 13.5017 4.12282 12.9533 4.05701C11.4019 3.87081 9.82989 4.14303 8.43141 4.84005C7.03292 5.53708 5.86917 6.62839 5.08384 7.97926C4.80626 8.45672 4.19419 8.61876 3.71672 8.34119Z" fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd" 
            d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68628 15.3137 5.99999 12 5.99999C8.68629 5.99999 6 8.68628 6 12C6 15.3137 8.68629 18 12 18Z" fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd" 
            d="M20.8569 10.115C21.4065 10.0604 21.8963 10.4616 21.9509 11.0112C22.144 12.9548 21.7638 14.9125 20.857 16.6424C19.9503 18.3724 18.5567 19.799 16.8485 20.746C16.3655 21.0138 15.7568 20.8393 15.489 20.3563C15.2213 19.8732 15.3957 19.2646 15.8788 18.9968C17.2454 18.2392 18.3602 17.0979 19.0856 15.714C19.811 14.33 20.1152 12.7639 19.9607 11.209C19.9061 10.6594 20.3073 10.1696 20.8569 10.115Z" fill="currentColor"></path>
            <path d="M6.34315 17.6568C7.89977 19.2135 9.93829 19.9945 11.9785 20C12.4928 20.0013 12.9654 20.3306 13.0791 20.8322C13.2105 21.4123 12.8147 21.9846 12.22 21.9976C9.58797 22.0552 6.93751 21.0796 4.92893 19.0711C2.90126 17.0434 1.92639 14.3616 2.00433 11.7049C2.02177 11.1104 2.59704 10.7188 3.17612 10.8546C3.67682 10.9721 4.00256 11.4471 4.00009 11.9614C3.99021 14.0216 4.77123 16.0849 6.34315 17.6568Z" fill="currentColor"></path>
            {newUpdates && <circle cx="19.95" cy="4.05005" r="3" fill="#009588"></circle>}
        </svg>
    )
};
export const Search = ({ className }) => <MdOutlineSearch className={className} />;
export const DropDownIcon = ({ className }) => <MdKeyboardArrowDown className={className} />;
export const AtIcon = ({ className }) => <MdOutlineAlternateEmail className={className} />;
export const PinIcon = ({ className }) => <BsPinAngleFill className={className} />;
export const CheckBoxBlank = ({ className }) => <MdCheckBoxOutlineBlank className={className} />;
export const CheckBoxChecked = ({ className }) => <MdCheckBox className={className} />;
export const CloseIcon = ({ className }) => <AiOutlineClose className={className} />;
export const ArrowLeftIcon = ({ className }) => <AiOutlineArrowLeft className={className} />;
export const ImageIcon = ({ className }) => <BsCameraFill className={className} />;
export const LinkIcon = ({ className }) => <BiLinkAlt className={className} />;
export const AudioIcon = ({ className }) => <BiSolidMicrophone className={className} />;
export const VideoIcon = ({ className }) => <MdVideocam className={className} />;
export const PhoneIcon = ({ className }) => <BsFillTelephoneFill className={className} />;
export const MessageIcon = ({ className }) => <MdOutlineMessage className={className} />;
export const SendIcon = ({ className }) => <MdSend className={className} />;
export const EmojiFillIcon = ({ className }) => <BsEmojiSmileFill className={className} />;
export const EmojiIcon = ({ className }) => <BsEmojiSmile className={className} />;
export const DeliveredIcon = ({ className }) => <BsCheck2All className={className} />;
export const SentIcon = ({ className }) => <BsCheck2 className={className} />;
export const PlusFillCircleIcon = ({ className }) => <AiFillPlusCircle className={className} />;