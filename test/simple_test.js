/* eslint-disable padded-blocks, arrow-body-style, arrow-parens */
const { getProcessingPage, STATES, ERRORS, PAGE_TITLES, ERROR_MESSAGES } = require('../src/index.js');

const TIMING_MARGIN = 10;

describe('simple', () => {

  it('should succeed', () => {

    return getProcessingPage([{
      state: STATES.SUCCESS,
    }])
      .then(result => expect(result).toEqual({
        title: PAGE_TITLES.SUCCESS,
        message: null,
      }));

  });

  it('should ignore errorCode in success case', () => {

    return Promise.all([

      getProcessingPage([{
        state: STATES.SUCCESS,
        errorCode: ERRORS.NO_STOCK,
      }])
        .then(result => expect(result).toEqual({
          title: PAGE_TITLES.SUCCESS,
          message: null,
        })),

      getProcessingPage([{
        state: STATES.SUCCESS,
        errorCode: null,
      }])
        .then(result => expect(result).toEqual({
          title: PAGE_TITLES.SUCCESS,
          message: null,
        })),

      getProcessingPage([{
        state: STATES.SUCCESS,
        errorCode: 'some other string',
      }])
        .then(result => expect(result).toEqual({
          title: PAGE_TITLES.SUCCESS,
          message: null,
        })),

    ]);


  });


  it('should succeed immediately', () => {

    const start = Date.now();

    return getProcessingPage([{
      state: STATES.SUCCESS,
    }])
      .then(() => expect(Date.now() - start).toBeLessThan(TIMING_MARGIN));

  });


  it('should succeed eventually', () => {

    const start = Date.now();

    return Promise.all([

      getProcessingPage([{
        state: STATES.PROCESSING,
      }, {
        state: STATES.SUCCESS,
      }])
        .then(() => expect(Date.now() - (start + 2000)).toBeLessThan(TIMING_MARGIN)),

      getProcessingPage([{
        state: STATES.PROCESSING,
      }, {
        state: STATES.PROCESSING,
      }, {
        state: STATES.SUCCESS,
      }])
        .then(() => expect(Date.now() - (start + 4000)).toBeLessThan(TIMING_MARGIN)),

    ]);

  });


  it('should error out', () => {

    return Promise.all([

      getProcessingPage([{
        state: STATES.ERROR,
        errorCode: ERRORS.NO_STOCK,
      }])
        .then(result => expect(result).toEqual({
          title: PAGE_TITLES.ERROR,
          message: ERROR_MESSAGES[ERRORS.NO_STOCK],
        })),

      getProcessingPage([{
        state: STATES.ERROR,
        errorCode: ERRORS.INCORRECT_DETAILS,
      }])
        .then(result => expect(result).toEqual({
          title: PAGE_TITLES.ERROR,
          message: ERROR_MESSAGES[ERRORS.INCORRECT_DETAILS],
        })),

      getProcessingPage([{
        state: STATES.ERROR,
        errorCode: undefined,
      }])
        .then(result => expect(result).toEqual({
          title: PAGE_TITLES.ERROR,
          message: null,
        })),

      getProcessingPage([{
        state: STATES.ERROR,
        errorCode: null,
      }])
        .then(result => expect(result).toEqual({
          title: PAGE_TITLES.ERROR,
          message: null,
        })),

    ]);

  });

  it('should fail for unrecognised states', () => {

    expect.assertions(3);
    return Promise.all([

      getProcessingPage([{
        state: 'Shneebly-deebly-doobly!',
      }])
        .catch(e => expect(e.message).toMatch(/unexpected state: 'Shneebly-deebly-doobly!'/)),

      getProcessingPage([{
        state: 5,
      }])
        .catch(e => expect(e.message).toMatch(/unexpected state: '5'/)),

      getProcessingPage([{
        state: STATES.PROCESSING,
      }, {
        state: STATES.PROCESSING,
      }, {
        state: () => { return 'a function is not a valid "state"'; },
        errorCode: ERRORS.NO_STOCK,
      }])
        .catch(e => expect(e.message).toMatch(/unexpected state: 'function/)),
    ]);

  });

  it('should fail for unrecognised errorCodes', () => {

    expect.assertions(3);
    return Promise.all([

      getProcessingPage([{
        state: STATES.ERROR,
        errorCode: 'ABSOLUTELY_NO_STOCK',
      }])
        .catch(e => expect(e.message).toMatch(/unexpected errorCode: 'ABSOLUTELY_NO_STOCK'/)),

      getProcessingPage([{
        state: STATES.ERROR,
        errorCode: 5,
      }])
        .catch(e => expect(e.message).toMatch(/unexpected errorCode: '5'/)),

      getProcessingPage([{
        state: STATES.PROCESSING,
      }, {
        state: STATES.PROCESSING,
      }, {
        state: STATES.ERROR,
        errorCode: () => { return 'a function is not a valid errorCode either'; },
      }])
        .catch(e => expect(e.message).toMatch(/unexpected errorCode: 'function/)),

    ]);

  });

  it('should fail *somehow* on bad input', () => {

    expect.assertions(8);

    return Promise.all([

      expect(getProcessingPage([])).rejects.toThrow(),

      expect(getProcessingPage(null)).rejects.toThrow(),

      expect(getProcessingPage(undefined)).rejects.toThrow(),

      expect(getProcessingPage([
        'hello world',
      ])).rejects.toThrow(),

      expect(getProcessingPage([
        { state: STATES.PROCESSING },
        undefined,
      ])).rejects.toThrow(),

      expect(getProcessingPage([
        { noStateHere: true },
      ])).rejects.toThrow(),


      expect(getProcessingPage([
        { state: STATES.PROCESSING },
        'hello world',
        { state: STATES.SUCCESS },
      ])).rejects.toThrow(),

      expect(getProcessingPage([5])).rejects.toThrow(),

    ]);
  });

});
