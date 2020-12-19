import React from 'react';
import logoImg from '../../../assets/icons/logo.svg';
import { useHistory } from 'react-router-dom';
import './Header.less';

interface HeaderProps {
  isLogIn?: boolean;
}

const Header: React.FC<HeaderProps> = props => {
  const history = useHistory();
  const currentUrl = history.location.pathname;
  let headerButton;
  if (currentUrl == '/auth/login') {
    headerButton = (
      <button
        onClick={() => {
          history.push('/auth/register');
        }}
        className="top-login-button"
      >
        Create Account
      </button>
    );
  } else if (currentUrl == '/auth/register') {
    headerButton = (
      <div>
        <span className="top-have-account">Already have an account? </span>
        <button
          onClick={() => {
            history.push('/auth/login');
          }}
          className="top-login-button"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '55px',
        backgroundColor: '#5D2E8C',
        padding: '0 16px',
        zIndex: 100,
      }}
    >
      <div
        className="logo"
        style={{
          display: 'inline-flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            textAlign: 'left',
            color: 'white',
          }}
        >
          <img src={logoImg} alt="logo" />
        </div>
        <div>{headerButton}</div>
        {props.isLogIn && (
          <div>
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#9646F5',
                borderRadius: '50%',
                fontSize: '12px',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
              }}
              id="profile-icon"
            >
              AB
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
