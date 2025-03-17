import React, { useEffect, useState } from 'react';
import { User, Lock, Edit2, AlertCircle, Gift, Copy, CheckCircle, Share2 } from 'lucide-react';
import { editProfile, getUserProfile } from '@/Api/User/profileApi';
import { validateProfile } from '@/Validators/userSignupValidation';
import { message } from 'antd';
import PasswordChangeModal from './PasswordChangeModal';

const PersonalInformation = () => {
  const [userDetails, setUserDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserProfile();
        console.log(response);
        setUserDetails(response.userDetails);
        setFormData(response.userDetails);
      }
      catch(error) {
        console.log(error?.message);
      }
    }

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setErrors({});
    setServerError("");

    const { error } = validateProfile(formData);
    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        validationErrors[err.path[0]] = err.message; 
      });

      setErrors(validationErrors);
      message.error("Please correct the validation errors.");
      return;
    }

    setLoading(true);

    try {
      const response = await editProfile(formData);
      console.log(response)
      message.success(response.message);
      setUserDetails(formData);
      setIsEditing(false);
    } catch (error) {
      setServerError(error.message || "Failed to update profile.");
      message.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };

  const copyReferralLink = () => {
    const referralCode = userDetails.referralCode;
    const referralLink = `http://localhost:5173/signup?ref=${referralCode}`;
    
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        message.success('Referral link copied to clipboard!');
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        message.error('Failed to copy referral link');
      });
  };

  
  const shareReferralLink = () => {
    const referralCode = userDetails.referralCode ;
    const referralLink = `http://localhost:5173/signup?ref=${referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join using my referral link',
        text: 'Sign up using my referral link and we both get rewards!',
        url: referralLink,
      })
        .then(() => message.success('Thanks for sharing!'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <User size={24} className="text-gray-700" />
          <h1 className="text-2xl font-semibold text-gray-800">Personal Information</h1>
          {serverError && <p className="text-red-500 text-sm mt-1">{serverError}</p>}
        </div>
        
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg 
                     hover:bg-gray-200 transition-colors duration-300 font-medium"
          >
            <Edit2 size={18} />
            Edit Information
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Information Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">First Name</label>
              {isEditing ? (
                <>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                  className="w-full text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </>
              ) : (
                <div className="text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg">
                  {userDetails.firstName || "N/A"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Last Name</label>
              {isEditing ? (
                <>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  className="w-full text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </>
              ) : (
                <div className="text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg">
                  {userDetails.lastName || "N/A"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Email Address
                {isEditing && <span className="ml-2 text-xs text-gray-400">(Cannot be changed)</span>}
              </label>
              {isEditing ? (
                <div className="relative" 
                    onMouseEnter={() => setShowEmailTooltip(true)}
                    onMouseLeave={() => setShowEmailTooltip(false)}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    disabled
                    className="w-full text-lg font-medium text-gray-500 p-3 bg-gray-100 rounded-lg border border-gray-200 cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <AlertCircle size={18} />
                  </div>
                  
                  {showEmailTooltip && (
                    <div className="absolute z-10 w-64 px-4 py-2 mt-2 text-sm text-white bg-gray-800 rounded-md shadow-lg">
                      Email address cannot be edited directly. Please contact support for email changes.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg">
                  {userDetails.email || "N/A"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Mobile Number</label>
              {isEditing ? (
                <>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </>
              ) : (
                <div className="text-lg font-medium text-gray-800 p-3 bg-gray-50 rounded-lg">
                  {userDetails.phone || "N/A"}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6 flex flex-wrap justify-between gap-4">
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg 
                        hover:bg-gray-800 transition-colors duration-300 font-medium"
            >
              <Lock size={18} />
              Change Password
            </button>

            {isEditing && (
              <div className="flex gap-3">
                <button 
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg 
                          hover:bg-gray-200 transition-colors duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg transition-colors duration-300 font-medium ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Refer to Earn Card */}
        <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <Gift size={24} className="text-white" />
            <h2 className="text-xl font-semibold">Refer & Earn</h2>
          </div>
          
          <p className="mb-6 text-white/90 text-sm">
            Invite your friends and family to join us. Both of you will receive rewards when they sign up using your referral link.
          </p>
          
          {/* Referral Link Section */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium text-white/80 mb-2">Your Referral Link</label>
            <div className="flex items-center bg-white/30 rounded-lg p-2 break-all">
              <span className="text-sm truncate flex-1">
                http://localhost:5173/signup?ref={userDetails.referralCode || userDetails._id || 'USER123'}
              </span>
              <button 
                onClick={copyReferralLink} 
                className="ml-2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
          
          <button 
            onClick={shareReferralLink}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-indigo-600 rounded-lg 
                      hover:bg-white/90 transition-colors duration-300 font-medium"
          >
            <Share2 size={18} />
            Share Your Link
          </button>
        </div>
      </div>

      <PasswordChangeModal 
        isOpen={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        email={userDetails.email}
      />
    </div>
  );
};

export default PersonalInformation;


