import BCHJS from '@psf/bch-js';

let bchjs;
if (process.env.REACT_APP_NETWORK === 'mainnet') {
  bchjs =  new BCHJS({
    restURL: 'https://free-main.fullstack.cash/v3/'
  });
} else {
  bchjs =  new BCHJS({
    restURL: 'https://free-test.fullstack.cash/v3/'
  });
}

export { bchjs };
