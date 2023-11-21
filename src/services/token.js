class TokenUtil {
    constructor(value) {
        this.token = localStorage.getItem('GAB')||value;
    }

    setToken(token) {
        this.token = `Bearer ${token}`;
    }
    getToken() {
        return this.token;
    }
};

let Token = new TokenUtil('token');

export default Token;