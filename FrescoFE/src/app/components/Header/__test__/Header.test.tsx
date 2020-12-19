import React from 'react';
import '@testing-library/jest-dom';
import { render, RenderResult } from '@testing-library/react';
import Header from '..';
let documentBody: RenderResult;

describe('<Header />', () => {
  beforeEach(() => {
    documentBody = render(<Header isLogIn={true} />);
  });
  it('shows AB when user is logged in ', () => {
    expect(documentBody.getByText('AB')).toBeInTheDocument();
  });
});
