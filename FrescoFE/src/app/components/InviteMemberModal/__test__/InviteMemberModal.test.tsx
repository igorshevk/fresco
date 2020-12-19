import React from 'react';
import '@testing-library/jest-dom';
import { render, RenderResult } from '@testing-library/react';
import { InviteMemberModal } from '..';
import '../../../../../__mocks__/matchMedia.mock';
import { PERMISSION } from 'app/containers/Dashboard';
let documentBody: RenderResult;

describe('<InviteMemberModal />', () => {
  beforeEach(() => {
    const props = {
      onCancel: jest.fn(),
      handleInvitation: jest.fn(),
      listEmail: [
        {
          id: '1',
          email: 'em1@em.com',
        },
      ],
      email: { email: 'test@test.test' },
      handleSearch: jest.fn(),
      handleSelectEmail: jest.fn(),
      handleChangePermission: jest.fn(),
      loading: false,
    };

    documentBody = render(<InviteMemberModal {...props} />);
  });
  it('shows AB when user is logged in ', () => {
    expect(documentBody.getByText('Invite to team')).toBeInTheDocument();
  });
  it('shows Email addresses ', () => {
    expect(documentBody.getByText('Email addresses')).toBeInTheDocument();
  });
  it('shows Send invitations ', () => {
    expect(documentBody.getByText('Send invitations')).toBeInTheDocument();
  });
  it('shows permissions editor ', () => {
    expect(documentBody.getByText(PERMISSION.EDITOR)).toBeInTheDocument();
  });
});
