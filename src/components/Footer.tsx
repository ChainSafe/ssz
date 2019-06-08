import * as React from 'react';

import pkg from '../../package.json';


export default function() {
  return (
    <footer className='footer'>
      <div className='content has-text-centered'>
        Made with ❤️ by <a className='is-link has-text-danger is-family-code' href='https://chainsafe.io'>Chainsafe Systems</a>
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
