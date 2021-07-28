import Cookies from 'js-cookie'
const session_id = 'session_id';

export function getSessionID() {
    return Cookies.get(session_id);
}

export function setSessionID(data) {

    return Cookies.set(session_id, data);
}

export function removeSessionID() {
    return Cookies.remove(session_id);
}
