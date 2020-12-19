import React from 'react';
import '@testing-library/jest-dom';
import { render, RenderResult } from '@testing-library/react';
import { GoogleButton } from '..';
let documentBody: RenderResult;

describe('<GoogleButton />', () => {
  beforeEach(() => {
    documentBody = render(
      <GoogleButton
        callback={() => {
          jest.fn();
        }}
      />,
    );
  });
  it('shows Use Google Account message', () => {
    expect(documentBody.getByText('Use Google Account')).toBeInTheDocument();
  });
});
