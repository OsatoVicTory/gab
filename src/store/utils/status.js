export default class StatusUtils {
    Init(state, [ Data ]) {
        const d = [...Data.data];
        const res = [];
        for(let i = 0; i < d.length; i++) res[i] = { ...d[i], pos: i };
        return { 
            mine: [...Data.mine],
            data: [...res], 
            newStatus: Data.newStatus, 
            loaded: true,
        };
    }
    refresh(state, [ acct ]) {
        const status = state.data;
        let data = [];
        const FULL_DAY = 86400000;
        const time = (new Date()).getTime();
        const getSecs = (date) => (new Date(date)).getTime();
        const mine = state.mine.filter(s => time - getSecs(s.createdAt) < FULL_DAY);

        for(let s = 0; s < status.length; s++) {
            const { statuses, account } = status[s];
            let tmp = [], viewed = 0;
            for(let t = 0; t < statuses.length; t++) {
                if(statuses[t].isDeleted) continue;
                if(time - getSecs(statuses[t].createdAt) >= FULL_DAY) continue;
                
                if(status[t].viewed) viewed++;
                tmp.push(statuses[t]);
            }
            if(tmp.length > 0) {
                data.push({ 
                    account, statuses: tmp, viewed: Math.min(tmp.length, viewed), 
                    completed: viewed >= tmp.length ? 1 : 0 
                });
            }
        }
        // data.sort((x, y) => x.completed - y.completed);
        let idx = 0;
        for(let i = 0; i < data.length; i++) {
            if(!data[i].completed) data[i].pos = idx++;
        }
        for(let i = 0; i < data.length; i++) {
            if(data[i].completed) data[i].pos = idx++;
        }
        return { ...state, mine, data, newStatus: false };
    }
    propagateAccount(state, [ accountId, accountData ]) {
        let { data } = state;
        for(let i = 0; i < data.length; i++) {
            if(data[i].account._id === accountId) {
                const newAcct = { ...data[i].account, ...accountData };
                data[i].account = newAcct;
                break;
            }
        }
        return { ...state, data };
    }
    iPost(state, [ status ]) {
        let { mine } = state;
        mine.push(status);
        return { ...state, mine, newStatus: false };
    }
    receiveStatus(state, [ account, status ]) {
        const { data } = state;
        let index = data.length;
        for(let s = 0; s < data.length; s++) {
            if(data[s].account._id === account._id) {
                data[s].statuses.push(status);
                data[s].completed = 0;
                index = s;
                break;
            } 
        }
        for(let i = 0; i < data.length; i++) {
            if(data[i].account._id === account._id) data[i].pos = 0;
            else data[i].pos = data[i].pos + (index > data[i].pos ? 1 : 0);
        }
        if(index === data.length) {
            data.push({ account, statuses: [status], completed: 0, viewed: 0, pos: 0 });
        }
        return { ...state, data, newStatus: true };
    }
    deleteMyStatus(state, [ statusId ]) {
        let { mine } = state;
        for(let i = 0; i < mine.length; i++) {
            if(mine[i]._id === statusId) {
                mine[i].isDeleted = true;
                break;
            }
        }
        return { ...state, mine };
    }
    deleteStatus(state, [ accountId, statusId ]) {
        let { data } = state;
        for(let s = 0; s < data.length; s++) {
            if(data[s].account._id === accountId) {
                const { statuses } = data[s];
                for(let st = 0; st < statuses.length; st++) {
                    if(statuses[st]._id === statusId) {
                        data[s].statuses[st].isDeleted = true;
                        break;
                    }
                }
                break;
            }
        }
        return { ...state, data, newStatus: false };
    }
    viewedMyStatus(state, [ viewerId, statusId, time ]) {
        let { mine } = state;
        for(let s = 0; s < mine.length; s++) {
            if(mine[s]._id === statusId) {
                if(!mine[s].viewers.find(v => v.userId === viewerId)) {
                    mine[s].viewers.push({ userId: viewerId, time });
                }
                break;
            }
        }
        return { ...state, mine };
    }
    userView(state, [ now ]) {
        const mine = state.mine.filter(s => !s.isDeleted);
        return { ...state, mine };
    }
    leaveView(state, [ mp ]) {
        const status = state.data;
        let data = [];
        const FULL_DAY = 86400000;
        const time = (new Date()).getTime();
        const getSecs = (date) => (new Date(date)).getTime();
        for(let s = 0; s < status.length; s++) {
            const { statuses, account } = status[s];
            let tmp = [], viewed = 0;
            for(let t = 0; t < statuses.length; t++) {
                if(time - getSecs(statuses[t].createdAt) >= FULL_DAY) continue;
                if(statuses[t].isDeleted) continue;

                const isViewed = mp.has(statuses[t]._id)||statuses[t].viewed;
                if(isViewed) viewed++;
                tmp.push({ ...statuses[t], viewed: isViewed });
            }
            
            if(tmp.length > 0) {
                data.push({ 
                    account, statuses: tmp, viewed: Math.min(tmp.length, viewed), 
                    completed: viewed >= tmp.length ? 1 : 0 
                });
            }
        }
        // data.sort((x, y) => x.completed - y.completed);
        let idx = 0;
        for(let i = 0; i < data.length; i++) {
            if(!data[i].completed) data[i].pos = idx++;
        }
        for(let i = 0; i < data.length; i++) {
            if(data[i].completed) data[i].pos = idx++;
        }
        return { ...state, data, newStatus: false };
    }
}