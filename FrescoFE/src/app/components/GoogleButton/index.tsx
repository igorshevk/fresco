import React from 'react';
import { Button, Image } from 'antd';

export const GoogleButton = ({ callback }) => {
  const login = () => {
    callback();
  };

  return (
    <Button type="default" block onClick={login}>
      <Image
        width={25}
        height={25}
        src={require('../../../assets/images/icon_google.png')}
      />
      Use Google Account
    </Button>
  );
};
