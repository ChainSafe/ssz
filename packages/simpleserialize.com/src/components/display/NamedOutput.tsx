import * as React from "react";

type Props = {
  name: string | undefined;
  value: string | undefined;
  textarea: boolean;
};

const NamedOuput = ({name, value, textarea}: Props): JSX.Element => (
  <div className='field has-addons'>
    <div className='control'>
      <a className='button is-static'>
        {name}
      </a>
    </div>
    <div className='control is-expanded'>
      {textarea ?
        <textarea className='input'
          readOnly={true}
          value={value || ""}
        />
        :
        <input className='input'
          type='text'
          readOnly={true}
          value={value || ""}
        />
      }
    </div>
  </div>
);

export default NamedOuput;