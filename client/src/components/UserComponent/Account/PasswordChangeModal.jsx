// import React, { useState } from "react";
// import { X, Eye, EyeOff } from "lucide-react";
// import { forgotChangePassword } from "@/Api/User/authApi";
// import { message } from "antd";
// import { PASSWORD_REGEX } from "@/Validators/password.regex";

// const PasswordChangeModal = ({ isOpen, onClose, email }) => {
//   const validateForm = ({ newPassword, confirmPassword }) => {
//     const errors = {};

//     if (!newPassword) {
//       errors.newPassword = "Password is required";
//     } else if (!PASSWORD_REGEX.test(newPassword)) {
//       errors.newPassword =
//         "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
//     }

//     if (!confirmPassword) {
//       errors.confirmPassword = "Confirm password is required";
//     } else if (newPassword !== confirmPassword) {
//       errors.confirmPassword = "Passwords do not match";
//     }

//     return errors;
//   };

//   const [formData, setFormData] = useState({
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState({
//     new: false,
//     confirm: false,
//   });

//   const [error, setError] = useState({
//   newPassword: "",
//   confirmPassword: "",
// });

//   const [serverError, setServerError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     setError((prev) => ({
//       ...prev,
//       [name]: "",
//     }));
//   };

//   const togglePasswordVisibility = (field) => {
//     setShowPassword((prev) => ({
//       ...prev,
//       [field]: !prev[field],
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validateForm(formData);

//     if (Object.keys(validationErrors).length > 0) {
//       setError(validationErrors);
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await forgotChangePassword({
//         email,
//         newPassword: formData.newPassword,
//         confirmPassword: formData.confirmPassword,
//       });

//       message.success(response.message);
//       setError({ newPassword: "", confirmPassword: "" });
//       setServerError("");
//       setFormData({ newPassword: "", confirmPassword: "" });
//       onClose();
//     } catch (err) {
//       const field = err?.field;
//       const msg = err?.message || "Failed to change password";

//       if (field) {
//         setError((prev) => ({
//           ...prev,
//           [field]: msg,
//         }));
//       } else {
//         setServerError(msg);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-xl font-semibold text-gray-800">
//             Change Password
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6">
//           {error && (
//             <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg">
//               {error}
//             </div>
//           )}
//           {serverError && (
//             <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg">
//               {serverError}
//             </div>
//           )}

//           {/* New Password Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               New Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword.new ? "text" : "password"}
//                 name="newPassword"
//                 value={formData.newPassword}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 rounded-lg border 
//                  ${error.newPassword ? "border-red-500" : "border-gray-300"}`}
//                 placeholder="Enter new password"
//               />
//               <button
//                 type="button"
//                 onClick={() => togglePasswordVisibility("new")}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Confirm Password Field */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Confirm New Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword.confirm ? "text" : "password"}
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 rounded-lg border 
//                   ${
//                     error.confirmPassword ? "border-red-500" : "border-gray-300"
//                   }`}
//                 placeholder="Confirm new password"
//               />
//               <button
//                 type="button"
//                 onClick={() => togglePasswordVisibility("confirm")}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword.confirm ? (
//                   <EyeOff size={20} />
//                 ) : (
//                   <Eye size={20} />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`flex-1 px-4 py-3 text-white bg-black rounded-lg hover:bg-gray-800 transition-colors font-medium 
//                 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//             >
//               {isLoading ? "Changing..." : "Change Password"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PasswordChangeModal;



import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { forgotChangePassword } from "@/Api/User/authApi";
import { message } from "antd";
import { PASSWORD_REGEX } from "@/Validators/password.regex";

const PasswordChangeModal = ({ isOpen, onClose, email }) => {
  // 🔹 Frontend validation
  const validateForm = ({ newPassword, confirmPassword }) => {
    const errors = {};

    if (!newPassword) {
      errors.newPassword = "Password is required";
    } else if (!PASSWORD_REGEX.test(newPassword)) {
      errors.newPassword =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  // ✅ Field-wise error object
  const [error, setError] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ Server-level error
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error on typing
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Frontend validation
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await forgotChangePassword({
        email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      message.success(response.message);
      setError({ newPassword: "", confirmPassword: "" });
      setServerError("");
      setFormData({ newPassword: "", confirmPassword: "" });
      onClose();
    } catch (err) {
      const field = err?.field;
      const msg = err?.message || "Failed to change password";

      if (field) {
        setError((prev) => ({
          ...prev,
          [field]: msg,
        }));
      } else {
        setServerError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Change Password
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg">
              {serverError}
            </div>
          )}

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  error.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {error.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  error.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword.confirm ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {error.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {error.confirmPassword}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-4 py-3 text-white bg-black rounded-lg ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
