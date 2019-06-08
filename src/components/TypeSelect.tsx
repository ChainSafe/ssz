import React from 'react';

import {names} from '../util/types';

export default function TypeSelect() {
  return (
    <div className="select">
      <select>
      {
        names.map((name) =>
          <option key={name}>{name}</option>
        )
      }
      </select>
    </div>
  );
}
