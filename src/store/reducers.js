import { combineReducers } from "redux";
import { userReducer } from "./user";
import { chatsReducer } from "./chats";
import { groupsReducer } from "./groups";
import { sessionsReducer } from './sessions';
import { fixedPagesReducer } from "./fixedPages";
import { statusMessageReducer } from "./statusMessage";
import { statusReducer } from "./status";

const reducers = combineReducers({
    user: userReducer,
    chats: chatsReducer,
    groups: groupsReducer,
    status: statusReducer,
    sessions: sessionsReducer,
    statusMessage: statusMessageReducer,
    fixedPages: fixedPagesReducer,
});

export default reducers;