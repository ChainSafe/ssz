import * as React from "react";

type Props = {
    name: string | undefined;
    value: string | undefined;
}

export default ({name, value}: Props) => (
    <div className='field has-addons'>
        <div className='control'>
            <a className='button is-static'>
                {name}
            </a>
        </div>
        <div className='control is-expanded'>
            <input className='input'
                   type='text'
                   readOnly={true}
                   value={value || ''}/>
        </div>
    </div>
);
