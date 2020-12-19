import React, { useState } from 'react';
import { MessagesApiService } from 'services/APIService/MessagesApi.service';

interface IState {
  orgId?: any;
}

export const ChatFooter = ({ boardId }) => {
  const [message, setMessage] = useState('');
  const handleSubmit = evt => {
    evt.preventDefault();
    MessagesApiService.postMessage(message, boardId).subscribe(data => {
      console.log(data);
      setMessage('');
    });
  };
  return (
    <div className="chatBox-footer">
      <form onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          type="text"
          placeholder="Write a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
