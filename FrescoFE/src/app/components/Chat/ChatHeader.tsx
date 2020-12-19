import React from 'react';
import chatHeaderIcon from 'assets/icons/chat-header.svg';
import chatCloseIcon from 'assets/icons/chat-close.svg';
interface IState {
  orgId?: any;
}

export const ChatHeader = ({ hide }) => {
  return (
    <div className="chatBox-header">
      <div className="d-flex">
        <img src={chatHeaderIcon} />
        <span className="chatBox-header-title">Live Chat</span>
      </div>
      <div>
        <button onClick={() => hide()} className="chatBox-header-close">
          <img src={chatCloseIcon} />
        </button>
      </div>
    </div>
  );
};
