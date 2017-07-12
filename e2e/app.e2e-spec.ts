import { TechnicalInterviewPage } from './app.po';

describe('technical-interview App', () => {
  let page: TechnicalInterviewPage;

  beforeEach(() => {
    page = new TechnicalInterviewPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
