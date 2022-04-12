import * as React from "react";
import classnames from "classnames";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type: string;
  error?: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextFieldGroup: React.FC<InputProps> = ({
  name,
  type,
  error,
  placeholder,
  onChange,
}) => {
  return (
    <div className="form-group">
      <input
        type={type}
        className={classnames("form-control form-control-lg", {
          "is-invalid": error,
        })}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
      />
      {error == null ? "" : <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default TextFieldGroup;
