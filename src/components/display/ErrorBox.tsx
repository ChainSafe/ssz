import * as React from "react";

type Props = {
  error: string | undefined;
  hideError: () => void;
};

const ErrorBox = ({error, hideError}: Props): JSX.Element => (
  <div className='notification'>
    <a className='delete'
      onClick={hideError}/>
    {error}
  </div>
);

export default ErrorBox;
