/* eslint-disable padded-blocks, arrow-body-style, arrow-parens */

/**
 * Gets the processing page
 * @param {array} data
 */
function getProcessingPage(data) {

  return new Promise((resolve, reject) => {

    try {

      let handleNextItem; // force hoisting so 'process' can access it

      const succeed = () => resolve({
        title: 'Order complete',
        message: null,
      });

      const process = (delay = 2000) => setTimeout(handleNextItem, delay);

      const errorOut = message => resolve({
        title: 'Error page',
        message,
      });

      const error = (errorCode) => {
        switch (errorCode) {

          case 'NO_STOCK':
            errorOut('No stock has been found');
            break;

          case 'INCORRECT_DETAILS':
            errorOut('Incorrect details have been entered');
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

            case 'success':
              succeed();
              break;

            case 'processing':
              process();
              break;

            case 'error':
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
};
