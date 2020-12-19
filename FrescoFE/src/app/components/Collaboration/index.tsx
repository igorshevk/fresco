import React, { memo, Fragment } from 'react';

interface Props {
  users: any[] | undefined;
}

export const Collaboration = memo((props: Props) => {
  const users = props?.users?.map(item => {
    return item.email;
  });

  return (
    <Fragment>
      <span className="user-title">{users?.join(' + ') || ''}</span>
    </Fragment>
  );
});
