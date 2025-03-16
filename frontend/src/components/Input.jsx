import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";

const Input = ({
  icon: Icon,
  type,
  passwordVisible,
  setPasswordVisible,
  ...props
}) => {
  const isPassword = type === "password";

  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-3 flex items-center">
        <Icon className="text-green-500 size-5" />
      </div>
      <input
        {...props}
        type={isPassword && !passwordVisible ? "password" : "text"}
        className="w-full pl-10 pr-12 py-2 bg-gray-100 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 rounded-md text-gray-900 placeholder-gray-500 transition"
        required
        aria-label={props.placeholder}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setPasswordVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-500"
          aria-label="Toggle password visibility"
        >
          {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
        </button>
      )}
    </div>
  );
};

export default Input;
