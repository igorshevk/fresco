import React from 'react';
import { ChatMessage } from './Chat-Message';
import chatUser from 'assets/icons/chat-user.svg';

interface IState {
  orgId?: any;
}

export const ChatBody = ({ messages }) => {
  return (
    <div className="chatBox-body">
      {messages.messages ? (
        messages.messages.map((message, index) => {
          return (
            <ChatMessage
              key={index}
              userName={message.sender.name}
              userImg={chatUser}
              message={message.message}
              logedUser={'friend'}
            />
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};
