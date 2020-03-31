# Vodafone coding challenge


## testing

to run the tests, run

```
> npm test
OR
> npm test -- --watchAll
```

## building

to build the library, run

```
> npm install
> npm run build
```


## Original specs


You have been tasked with creating a helper function that will be used to determine the output
of an array of data.

Each element of the array has the following structure:

```
  {
    state: <String> - a state to go to
    errorCode: <String> - optional error code
  }
```

The states have different functionalities:

  'processing' = delay by 2 seconds, then fetch the next state
  'error' = handle the error code provided (see below)
  'success' = return from the helper with the object: { title: 'Order complete' message: null }

Handling error codes:

  'NO_STOCK' = return from the helper with an object: `{ title: 'Error page', message: 'No stock has been found' }`
  'INCORRECT_DETAILS' = return from the helper with an object:` { title: 'Error page', message: 'Incorrect details have been entered' }`
  null = return from the helper with an object: `{ title: 'Error page', message: null }`
  undefined = return from the helper with an object: `{ title: 'Error page', message: null }`

Example usage:
-------

```javascript
getProcessingPage([{ state: 'processing' }, { state: 'error' }])
```

=> should return after 2 seconds with the object:

```javascript
{
  title: 'Error page',
  message: null
}
```

Notes:
- Provide the code and a description of how to run it
