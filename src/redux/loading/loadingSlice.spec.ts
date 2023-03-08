import loadingReducer, {hideLoading, showLoading} from './loadingSlice';

describe('Loading slice tests', () => {
  it('should show loading', () => {
    expect(loadingReducer(false, showLoading())).toEqual(true);
  });

  it('should hide loading', () => {
    expect(loadingReducer(true, hideLoading())).toEqual(false);
  });
});
