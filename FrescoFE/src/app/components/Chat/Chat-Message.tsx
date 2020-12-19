import React from 'react';
import chatUser from 'assets/icons/chat-user.svg';

interface IState {
  orgId?: any;
}

export const ChatMessage = ({ userName, userImg, message, logedUser }) => {
  return (
    <div className={`chatBox-body-message ${logedUser}`}>
      <div className="chatBox-body-message-user">
        <img src={userImg} />
        <span>{userName}</span>
      </div>
      <div className="chatBox-body-message-content">
        <p>{message}</p>
      </div>
      <div className="chatBox-message-settings">...</div>
    </div>
  );
};
