type Props = {
  label: string;
  value: string | number;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
};

export const InputField: React.FC<Props> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}) => {
  return (
    <div className="card_input_body">
      <div>
        <label className="card_input_body--lable input__name">{label}</label>
        <input
          type={type}
          value={value as any}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="card_input_body--input input__field"
        />
      </div>
      <button className="card_input_body--info-icon"></button>
      <div className="card_input_body--info">
        <p className="card_input_body--info-description">{hint}</p>
      </div>
    </div>
  );
};
