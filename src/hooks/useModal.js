import { useEffect } from 'react';

const useModal = (modalRef, closeModal) => {
    function toggleRef() {
        if(modalRef.current.classList.contains('hideModal')) {
            modalRef.current.classList.remove('hideModal');
            modalRef.current.classList.add('showModal');
        } else {
            modalRef.current.classList.remove('showModal');
            modalRef.current.classList.add('hideModal');
        }
    };
    function closeModalFunc() {
        if(modalRef.current) toggleRef();
        setTimeout(closeModal, 300);
    };
    function clickFunc(e) {

        if(!modalRef.current) return;
        
        if(modalRef.current && !modalRef.current.contains(e.target)) closeModalFunc();
    };
    const resizeFunc = (e) => closeModalFunc();
 
    useEffect(() => {
        if(modalRef.current) toggleRef();
        document.addEventListener('click', clickFunc, true);
        window.addEventListener('resize', resizeFunc);
        return () => {
            document.removeEventListener('click', clickFunc, true);
            window.removeEventListener('resize', resizeFunc);
        }
    }, []);
};

export default useModal;