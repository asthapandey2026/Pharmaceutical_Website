import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword, updateProfile, updateAddress, fetchUserProfile } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);
    const userData = user?.user || user;
    const userRole = user?.user?.role || user?.role;

    // State for different modal sections
    const [passwordSectionVisible, setPasswordSectionVisible] = useState(false);
    const [profileEditMode, setProfileEditMode] = useState(false);
    const [addressEditMode, setAddressEditMode] = useState(false);

    // State for form data
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const [addressData, setAddressData] = useState({
        houseNo: '',
        street: '',
        locality: '',
        city: '',
        pinCode: ''
    });

    const [passwordState, setPasswordState] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        error: ''
    });

    // Initialize form data when user data is available
    useEffect(() => {
        if (userData) {
            setProfileData({
                firstName: userData.name?.firstName || '',
                lastName: userData.name?.lastName || '',
                email: userData.email || '',
                phone: userData.phone || ''
            });

            if (userData.address) {
                setAddressData({
                    houseNo: userData.address.houseNo || '',
                    street: userData.address.street || '',
                    locality: userData.address.locality || '',
                    city: userData.address.city || '',
                    pinCode: userData.address.pinCode || ''
                });
            }
        }
    }, [userData]);

    // Authentication check
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Handle profile update
    const handleProfileUpdate = async () => {
        try {
            const profilePayload = {
                name: {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName
                },
                email: profileData.email,
                phone: profileData.phone
            };

            await dispatch(updateProfile(profilePayload)).unwrap();
            await dispatch(fetchUserProfile()).unwrap();
            setProfileEditMode(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error || 'Failed to update profile');
        }
    };

    // Handle address update sending a direct address object
    const handleAddressUpdate = async () => {
        try {
            // Validate pincode format
            if (addressData.pinCode && !/^\d{6}$/.test(addressData.pinCode)) {
                toast.error('Please enter a valid 6-digit PIN code');
                return;
            }

            // Check for empty required fields
            if (!addressData.houseNo || !addressData.city) {
                toast.error('House number and city are required');
                return;
            }

            // Create the address object directly without wrapping it
            const address = {
                houseNo: addressData.houseNo,
                street: addressData.street,
                locality: addressData.locality,
                city: addressData.city,
                pinCode: addressData.pinCode,// If this should be the default address
            };

            // Pass the address object directly to the updateAddress thunk
            await dispatch(updateAddress(address)).unwrap();
            
            // Refresh user profile to get updated data
            await dispatch(fetchUserProfile()).unwrap();
            
            setAddressEditMode(false);
            toast.success('Address updated successfully!');
        } catch (error) {
            console.error("Address update error:", error);
            toast.error(error || 'Failed to update address');
        }
    };

    // Handle password change
    const handlePasswordChange = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordState;

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordState(prev => ({
                ...prev,
                error: 'Please fill in all password fields'
            }));
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordState(prev => ({
                ...prev,
                error: 'New password and confirm password must match'
            }));
            return;
        }

        try {
            await dispatch(updatePassword({ currentPassword, newPassword })).unwrap();
            setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '', error: '' });
            setPasswordSectionVisible(false);
            toast.success('Password updated successfully!');
        } catch (error) {
            setPasswordState(prev => ({
                ...prev,
                error: error || 'Failed to update password'
            }));
        }
    };

    // Handle navigation to purchase history
    const handleViewPurchases = () => {
        if (userRole === 'admin') {
            navigate('/purchaseRequests');
        } else if (userRole === 'user') {
            navigate('/currentPurchase');
        } else {
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r bg-blue-50 flex items-center justify-center p-6">
            <div className="bg-white mt-20 shadow-2xl rounded-3xl p-8 w-full max-w-3xl">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-6">
                    <img
                        src={userData?.profilePicture || '/default-profile.png'}
                        alt="Profile"
                        className="w-36 h-36 rounded-full border-4 border-blue-800 object-cover shadow-md"
                    />
                    <h2 className="mt-4 text-xl font-bold text-blue-800">
                        {userData?.name?.firstName || 'User'} {userData?.name?.lastName || ''}
                    </h2>
                    <p className="text-gray-600">{userData?.email}</p>
                </div>

                {/* Profile Information Section */}
                {!profileEditMode ? (
                    <div className="border-t border-gray-200 pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">First Name:</span>
                            <span className="text-gray-600">{userData?.name?.firstName || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Last Name:</span>
                            <span className="text-gray-600">{userData?.name?.lastName || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="text-gray-600">{userData?.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Phone Number:</span>
                            <span className="text-gray-600">{userData?.phone || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Password:</span>
                            <button
                                onClick={() => setPasswordSectionVisible(!passwordSectionVisible)}
                                className="text-blue-800 underline text-sm font-medium hover:text-blue-600"
                            >
                                Change
                            </button>
                        </div>

                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setProfileEditMode(true)}
                                className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="border-t border-gray-200 pt-6 space-y-4">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4">Edit Profile</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={profileData.firstName}
                                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={profileData.lastName}
                                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setProfileEditMode(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProfileUpdate}
                                className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* Address Section */}
                {!addressEditMode ? (
                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                            <button
                                onClick={() => setAddressEditMode(true)}
                                className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition"
                            >
                                Edit Address
                            </button>
                        </div>
                        
                        {userData?.address ? (
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">House No:</span>
                                    <span>{userData.address.houseNo}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Street:</span>
                                    <span>{userData.address.street}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Locality:</span>
                                    <span>{userData.address.locality}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">City:</span>
                                    <span>{userData.address.city}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pin Code:</span>
                                    <span>{userData.address.pinCode}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                No address information available
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4">Edit Address</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">House No</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={addressData.houseNo}
                                    onChange={(e) => setAddressData({...addressData, houseNo: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={addressData.street}
                                    onChange={(e) => setAddressData({...addressData, street: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={addressData.locality}
                                    onChange={(e) => setAddressData({...addressData, locality: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={addressData.city}
                                    onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={addressData.pinCode}
                                    onChange={(e) => setAddressData({...addressData, pinCode: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setAddressEditMode(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddressUpdate}
                                className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* Current Purchases Button */}
                <div className="mt-6 text-center border-t border-gray-200 pt-6">
                    <button
                        onClick={handleViewPurchases}
                        className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-900"
                    >
                        View Current Purchases
                    </button>
                </div>

                {/* Password Change Section */}
                {passwordSectionVisible && (
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg shadow-inner">
                        <h2 className="text-xl font-bold text-blue-800 mb-3">Change Password</h2>

                        {passwordState.error && (
                            <div className="bg-blue-200 text-blue-700 p-2 rounded-md mb-2">
                                {passwordState.error}
                            </div>
                        )}

                        <input
                            type="password"
                            className="w-full px-4 py-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter current password"
                            value={passwordState.currentPassword}
                            onChange={(e) => setPasswordState(prev => ({
                                ...prev,
                                currentPassword: e.target.value
                            }))}
                        />

                        <input
                            type="password"
                            className="w-full px-4 py-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter new password"
                            value={passwordState.newPassword}
                            onChange={(e) => setPasswordState(prev => ({
                                ...prev,
                                newPassword: e.target.value
                            }))}
                        />

                        <input
                            type="password"
                            className="w-full px-4 py-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm new password"
                            value={passwordState.confirmPassword}
                            onChange={(e) => setPasswordState(prev => ({
                                ...prev,
                                confirmPassword: e.target.value
                            }))}
                        />

                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                                onClick={() => setPasswordSectionVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 transition-all"
                                onClick={handlePasswordChange}
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
