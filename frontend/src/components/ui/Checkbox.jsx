const Checkbox = ({ label, checked, onChange, id }) => {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2.5 cursor-pointer text-sm text-surface-300 hover:text-surface-100 transition-colors py-0.5"
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="checkbox-custom"
      />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
