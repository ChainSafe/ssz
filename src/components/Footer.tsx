import * as React from 'react';

import pkg from '../../package.json';


export default function() {
  return (
    <footer className='footer'>
      <div className='content has-text-centered'>
        Made with ❤️ by <a className='is-link has-text-danger is-family-code' href='https://chainsafe.io'>ChainSafe Systems</a><br/>
        and <a className='is-link has-text-danger is-family-code' href='https://github.com/ChainSafe/simpleserialize.com/graphs/contributors'>ETH 2.0 friends</a>
      </div>
      <div className='content has-text-centered is-small is-family-code'>
        <a className='is-link has-text-grey'
          href='https://www.npmjs.com/package/@chainsafe/ssz'>
          @chainsafe/ssz {pkg.dependencies['@chainsafe/ssz']}
        </a>
      </div>
    </footer>
  );
}
