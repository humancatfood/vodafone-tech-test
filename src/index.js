/* eslint-disable padded-blocks, arrow-body-style, arrow-parens */

const STATES = {
  SUCCESS: 'success',
  PROCESSING: 'processing',
  ERROR: 'error',
}

const ERRORS = {
  NO_STOCK: 'NO_STOCK',
  INCORRECT_DETAILS: 'INCORRECT_DETAILS',
}

const PAGE_TITLES = {
  SUCCESS: 'Order complete',
  ERROR: 'Error page',
}

const ERROR_MESSAGES = {
  [ERRORS.NO_STOCK]: 'No stock has been found',
  [ERRORS.INCORRECT_DETAILS]: 'Incorrect details have been entered',
}

/**
 * Gets the processing page
 * @param {array} data
 */
function getProcessingPage(data) {

  return new Promise((resolve, reject) => {

    try {

      let handleNextItem; // force hoisting so 'process' can access it

      const succeed = () => resolve({
        title: PAGE_TITLES.SUCCESS,
        message: null,
      });

      const process = (delay = 2000) => setTimeout(handleNextItem, delay);

      const errorOut = message => resolve({
        title: PAGE_TITLES.ERROR,
        message,
      });

      const error = (errorCode) => {
        switch (errorCode) {

          case ERRORS.NO_STOCK:
            case ERRORS.INCORRECT_DETAILS:
            errorOut(ERROR_MESSAGES[errorCode]);
            break;

          case null:
          case undefined:
            errorOut(null);
            break;

          default:
            reject(new Error(`unexpected errorCode: '${errorCode}'`));
            break;
        }
      };

      handleNextItem = () => {

        const item = data.shift();
        if (item) {
          switch (item.state) {

            case STATES.SUCCESS:
              succeed();
              break;

            case STATES.PROCESSING:
              process();
              break;

            case STATES.ERROR:
              error(item.errorCode);
              break;

            default:
              reject(new Error(`unexpected state: '${item.state}'`));
              break;

          }
        } else {
          reject(new Error(`received malformed item: ${item}`));
        }

      };

      handleNextItem();

    } catch (err) {
      reject(err);
    }
  });

}


module.exports = {
  getProcessingPage,
  STATES,
  ERRORS,
  PAGE_TITLES,
  ERROR_MESSAGES,
};
