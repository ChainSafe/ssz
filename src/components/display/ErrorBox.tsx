import * as React from "react";

type Props = {
    error: string | undefined
    hideError: () => void;
}


export default ({error, hideError}: Props) => (
    <div className='notification'>
        <a className='delete'
           onClick={hideError}/>
        {error}
    </div>
);