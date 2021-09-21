import Details from './Details';
import React from 'react';
//import '@testing-library/jest-dom/extend-expect';
import { render, waitFor } from '@testing-library/react';


describe('details page', () => {
  let originFetch;
  beforeEach(() => {
    originFetch = (global).fetch;
  });
  afterEach(() => {
    (global).fetch = originFetch;
  });
  it('should pass', async () => {
    const fakeResponse = { title: 'example text' };
    // const mRes = { first: jest.fn().mockResolvedValueOnce(fakeResponse) };
    // const mockedFetch = jest.fn().mockResolvedValueOnce(mRes);
    (global).fetch = { first: jest.fn().mockResolvedValueOnce(fakeResponse) };
    const { getByTestId } = render(<Details></Details>);
    const div = await waitFor(() => getByTestId('test'));
    expect(div).toHaveTextContent('example text');
    expect(mockedFetch).toBeCalledTimes(1);
    expect(mRes.json).toBeCalledTimes(1);
  });
});