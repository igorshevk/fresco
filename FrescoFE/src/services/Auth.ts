class Auth {
  public token;
  public user;

  constructor() {
    const authInfo = localStorage.getItem('authInformation');

    this.token = authInfo
      ? JSON.parse(authInfo || '{}').token.accessToken
      : null;
    this.user = authInfo ? JSON.parse(authInfo || '{}').user : null;
  }

  isLogged() {
    return !!this.token;
  }

  setToken(token) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }
  getUser() {
    return this.user;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authInformation');
  }
}

export default new Auth();
