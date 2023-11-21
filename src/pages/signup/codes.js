import { useState, useEffect, useRef } from 'react';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import './codes.css';
import { CloseIcon } from '../../component/Icons';


const CountryCodeModal = ({ setter, closeModal }) => {

    const mainRef = useRef();
    const [codeLists, setCodeLists] = useState([]);
    const [lists, setLists] = useState([]);

    useEffect(() => {

        const arr = getCountries().map(country => {
            const callingCode = getCountryCallingCode(country);
            return { country, code: '+'+callingCode };
        });
        setCodeLists(arr);
        setLists(arr);

        const clickFunc = (e) => {
            if(!mainRef.current) return;
            if(mainRef.current && !mainRef.current.contains(e.target)) closeModal();
        }

        document.addEventListener("click", clickFunc, true);

        return () => document.removeEventListener("click", clickFunc, true);

    }, []);

    function handleChange(e) {
        const value = e.target.value.toLowerCase();
        if(!value) setLists(codeLists);
        else setLists([...codeLists.filter(cd => cd.country.toLowerCase().includes(value))]);
    }

    return (
        <div className='CountryCodeModal'>
            <div className='countryCode__' ref={mainRef}>
                <div className='cCode_top'>
                    <div className='cCT'>
                        <div className='cCT_close' onClick={() => closeModal()}>
                            <CloseIcon className={'cCT_icon'} />
                        </div>
                        <input placeholder='Search country' onChange={handleChange} />
                    </div>
                </div>
                <div className='cCode_main hide_scroll_bar'>
                    <ul>
                        {lists.map((val, idx) => (
                            <li className='cCT_list' key={`cCT-${idx}`}
                            onClick={() => { setter(val); closeModal(); }}>
                                <span className='country'>{val.country}</span>
                                <span className='country_code'>{val.code}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default CountryCodeModal;