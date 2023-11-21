import img from '../images/avatar.png';
import img1 from '../images/img1.jpg';

const Zs = (val) => val >= 10 ? val : `0${val}`;
const F = (val) => String(val).slice(1, 5);

export const formatTimeFromDate = (date) => {
    let date_form = new Date(date);
    return `${Zs(date_form.getHours())}:${Zs(date_form.getMinutes())}`;
};

export const formatDay_TimeFromDate = (date) => {
    let date_form = new Date(date);
    let cur_date = new Date();
    if(date_form.getFullYear() !== cur_date.getFullYear()) {
        return `${Zs(date_form.getDate())}/${Zs(date_form.getMonth()+1)}/${F(date_form.getFullYear())}`;
    } else if(date_form.getMonth() !== cur_date.getMonth()) {
        return `${date_form.getDate()}/${Zs(date_form.getMonth()+1)}`;
    } else if(cur_date.getDay() !== date_form.getDay()) {
        return String(date_form).slice(0, 3);
    } else {
        return `${Zs(date_form.getHours())}:${Zs(date_form.getMinutes())}`;
    }
}

export const formatDateTimeFromDate = (date) => {
    if(date === 'online') return date;
    if(!date) return '';
    let date_form = new Date(date);
    let cur_date = new Date();
    if(!date_form) return 'NaN';
    if(date_form.getFullYear() !== cur_date.getFullYear()) {
        return `${String(date_form).slice(0, 15)} at ${Zs(date_form.getHours())}:${Zs(date_form.getHours())}`;
    } else if(date_form.getMonth() !== cur_date.getMonth()) {
        return `${String(date_form).slice(0, 10)} at ${Zs(date_form.getHours())}:${Zs(date_form.getHours())}`;
    } else if(cur_date.getDay() !== date_form.getDay()) {
        return `Yesterday at ${Zs(date_form.getHours())}:${Zs(date_form.getHours())}`;
    } else {
        return `Today at ${Zs(date_form.getHours())}:${Zs(date_form.getMinutes())}`;
    }
}

const hash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";
export const fakeStatusData = () => {
    
    const genTxt = () => hash.repeat(12);
    const randomId = () => ([...new Array(10).fill(0)].map(val => (
        Math.floor(Math.random() * 10)
    ))).join('');
    let len = 1;

    const genData = (x) => [...new Array(x).fill({})].map((v, i) => {
        let res = {
            account: { _id: randomId(), userName: 'Osato'+i, img },
            statuses: [], viewed: 0,
        };
        let curTime = (x + i - len) * 30000;
        for(let r = 0; r < i + x; r++) {
            res.statuses.push({
                img, hash, _id: randomId(),
                caption: (r % 2 == 0) ? genTxt() : null, index: r,
                createdAt: (new Date()).getTime() - curTime,
            });
            curTime -= 30000;
            len++;
        }
        return res;
    });

    return {
        mine: [],
        data: genData(3),
        newStatus: 2,
    }
}
const getFakeMessages = (userId, userName) => {
    let res = [];
    for(let k=0;k<40;k++) {
        if(k%2) {
            res.push({
                senderId: '987654321',senderUserName: userName,
                senderImg: img, receiverId: '123456789',
                senderPhoneNumber:'09065352839', message: 'Testing images',
                images: new Array(k % 7).fill({img: img1,hash}),
                createdAt: String(new Date()), _id: `${k}`,
            });
        } else {
            res.push({ time: 'Wednesday'+k });
            res.push({
                senderId: '123456789',senderUserName: 'Osato',
                senderImg: img, receiverId: userId,
                senderPhoneNumber:'09039221615', 
                message: 'Testing images: Osato dfhjhdal dsafhdfmadksf asugjkdsgh fldfsufhh sdfsdkfsdg flsdfsdfg lfsdfds fsdufkdj f sdfsdfsdg fsdfsd gfds fsdg fsdiufdsfius fdsgf dsfds fs',
                images: new Array(k % 7).fill({img: img1,hash}),
                createdAt: String(new Date()), _id: `${k}`,
            })
        }
    }
    return res;
}
export const getFakeData = (user, setChats, setGroups) => {
    if(user.userName === 'Osato') {
        setChats('Init', {data: [
            { account: {userName:'Tory',_id:'987654321',phoneNumber:'09065352839', lastSeen: 'online'},
            messages: [...getFakeMessages('987654321', 'Tory')], unreadMessages: 5, unReads: 5,
            taggedYou: '36', },
            { account: {userName:'Torhee_',_id:'9876543210',phoneNumber:'0906535200', lastSeen: 'online'},
            messages: [...getFakeMessages('9876543210', 'Torhee_')], unreadMessages: 4, unReads: 4,
            taggedYou: '37', }
        ], totalUnreadMessages: 2}, 0);
        setGroups('Init', {data: [
            { 
                account: {groupName:'AI Club',_id:'123456789',
                participants: [
                    {img, userId: `987654321`, userName:'Tory', 
                    admin: true, about:'iCode', phoneNumber: '09065352839'},
                    {img, userId: `12345678`, userName:'Torhee', about:'iCode', phoneNumber:'09087651324'},
                    {img, userId: `123456789`, userName:'Osato', 
                    admin: true, about:'iCodee', phoneNumber: '09039221615'}
                ] },
                messages: [
                    {senderId: '987654321',senderUserName:'Tory',message:'Sup group',
                    createdAt: String(new Date()), _id: `group-1`, images: []},
                    {senderId: '123456789',senderUserName:'You',message:'From you',
                    createdAt: String(new Date()), _id: `group-2`}
                ], unreadMessages: 0, unReads: 0, images: [],
            }
        ],totalUnreadMessages: 0});
    } else {
        setChats('Init', {data: [
            { account: {userName:'Osato',_id:'123456789',phoneNumber:'09039221615', lastSeen: 'online'},
            messages: [...getFakeMessages()], unreadMessages: 0, unReads: 0 }
        ], totalUnreadMessages: 0}, 0);
        setGroups('Init', {data: [],totalUnreadMessages: 0});
    }
}