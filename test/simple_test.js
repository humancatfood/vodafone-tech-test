/* eslint-disable padded-blocks, arrow-body-style, arrow-parens */
const { getProcessingPage } = require('../src/index.js');


describe('simple', () => {

  it('should succeed', () => {

    return getProcessingPage([{
      state: 'success',
    }])
      .then(result => expect(result).toEqual({
        title: 'Order complete',
        message: null,
      }));

  });

  it('should ignore errorCode in success case', () => {

    return Promise.all([

      getProcessingPage([{
        state: 'success',
        errorCode: 'NO_STOCK',
      }])
        .then(result => expect(result).toEqual({
          title: 'Order complete',
          message: null,
        })),

      getProcessingPage([{
        state: 'success',
        errorCode: null,
      }])
        .then(result => expect(result).toEqual({
          title: 'Order complete',
          message: null,
        })),

      getProcessingPage([{
        state: 'success',
        errorCode: 'some other string',
      }])
        .then(result => expect(result).toEqual({
          title: 'Order complete',
          message: null,
        })),

    ]);


  });


  it('should succeed immediately', () => {

    const start = Date.now();

    return getProcessingPage([{
      state: 'success',
    }])
      .then(() => expect(Date.now() - start).toBeLessThan(10));

  });


  it('should succeed eventually', () => {

    const start = Date.now();

    return Promise.all([

      getProcessingPage([{
        state: 'processing',
      }, {
        state: 'success',
      }])
        .then(() => expect(Date.now() - (start + 2000)).toBeLessThan(10)),

      getProcessingPage([{
        state: 'processing',
      }, {
        state: 'processing',
      }, {
        state: 'success',
      }])
        .then(() => expect(Date.now() - (start + 4000)).toBeLessThan(10)),

    ]);

  });


  it('should error out', () => {

    return Promise.all([

      getProcessingPage([{
        state: 'error',
        errorCode: 'NO_STOCK',
      }])
        .then(result => expect(result).toEqual({
          title: 'Error page',
          message: 'No stock has been found',
        })),

      getProcessingPage([{
        state: 'error',
        errorCode: 'INCORRECT_DETAILS',
      }])
        .then(result => expect(result).toEqual({
          title: 'Error page',
          message: 'Incorrect details have been entered',
        })),

      getProcessingPage([{
        state: 'error',
        errorCode: undefined,
      }])
        .then(result => expect(result).toEqual({
          title: 'Error page',
          message: null,
        })),

      getProcessingPage([{
        state: 'error',
        errorCode: null,
      }])
        .then(result => expect(result).toEqual({
          title: 'Error page',
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
        state: 'processing',
      }, {
        state: 'processing',
      }, {
        state: () => { return 'a function is not a valid "state"'; },
        errorCode: 'NO_STOCK',
      }])
        .catch(e => expect(e.message).toMatch(/unexpected state: 'function/)),
    ]);

  });

  it('should fail for unrecognised errorCodes', () => {

    expect.assertions(3);
    return Promise.all([

      getProcessingPage([{
        state: 'error',
        errorCode: 'ABSOLUTELY_NO_STOCK',
      }])
        .catch(e => expect(e.message).toMatch(/unexpected errorCode: 'ABSOLUTELY_NO_STOCK'/)),

      getProcessingPage([{
        state: 'error',
        errorCode: 5,
      }])
        .catch(e => expect(e.message).toMatch(/unexpected errorCode: '5'/)),

      getProcessingPage([{
        state: 'processing',
      }, {
        state: 'processing',
      }, {
        state: 'error',
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
        { state: 'processing' },
        undefined,
      ])).rejects.toThrow(),

      expect(getProcessingPage([
        { noStateHere: true },
      ])).rejects.toThrow(),


      expect(getProcessingPage([
        { state: 'processing' },
        'hello world',
        { state: 'success' },
      ])).rejects.toThrow(),

      expect(getProcessingPage([5])).rejects.toThrow(),

    ]);
  });

});
