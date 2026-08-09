interface AuthInputProps {
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function AuthInput({
  type,
  placeholder,
  value,
  onChange
}: AuthInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      className="w-full border-b border-neutral-300 py-3 outline-none focus:border-black font-normal"
      onChange={onChange}
      required
    />
  )
}

export default AuthInput
