import { ShoppingSitePage } from './app.po';

describe('shopping-site App', () => {
  let page: ShoppingSitePage;

  beforeEach(() => {
    page = new ShoppingSitePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
