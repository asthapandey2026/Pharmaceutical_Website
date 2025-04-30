import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllEnquiries } from "../store/slices/enquirySlice";
import { checkAuthStatus } from "../store/slices/authSlice";
import { Button } from "@mui/material";
import moment from "moment";
import EnquiryPopup from "../components/EnquiryPopup";

const AdminEnquiries = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enquiries, loading, error } = useSelector((state) => state.enquiry);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const pollIntervalRef = useRef(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Remove unused states and refs
  const [replyingTo, setReplyingTo] = useState(null);
  const isRequestPendingRef = useRef(false);

  const verifyAdminAccess = useCallback(async () => {
    try {
      const result = await dispatch(checkAuthStatus()).unwrap();
      const currentRole = result?.user?.role || result?.role;
      
      if (!result || currentRole !== 'admin') {
        navigate('/');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Admin verification failed:', err);
      navigate('/');
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [dispatch, navigate]);

  const fetchEnquiries = useCallback(async () => {
    if (!isAuthenticated || isRequestPendingRef.current) return;
    
    try {
      isRequestPendingRef.current = true;
      setIsRefreshing(true);
      await dispatch(getAllEnquiries()).unwrap();
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    } finally {
      isRequestPendingRef.current = false;
      setIsRefreshing(false);
    }
  }, [dispatch, isAuthenticated]);

  const handleReplyClick = useCallback((enquiry) => {
    // Clear any existing polling interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    
    setSelectedEnquiry(enquiry);
    setReplyingTo(enquiry._id);
  }, []);

  const handlePopupClose = useCallback(() => {
    setSelectedEnquiry(null);
    setReplyingTo(null);
    
    // Restart polling
    if (!pollIntervalRef.current) {
      fetchEnquiries();
      pollIntervalRef.current = setInterval(fetchEnquiries, 30000);
    }
  }, [fetchEnquiries]);

  // Initial setup and polling
  useEffect(() => {
    verifyAdminAccess();
  }, [verifyAdminAccess]);

  useEffect(() => {
    if (isChecking || !isAuthenticated) return;

    fetchEnquiries();
    
    // Only set up polling if popup is not open
    if (!selectedEnquiry) {
      pollIntervalRef.current = setInterval(fetchEnquiries, 30000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isChecking, isAuthenticated, fetchEnquiries, selectedEnquiry]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Queries</h1>
        
        {error && (
          <div className="bg-blue-100 text-blue-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {loading && !enquiries.length ? (
            <div className="text-center py-4">
              <div className="animate-spin inline-block rounded-full h-8 w-8 border-b-2 border-blue-800" />
            </div>
          ) : enquiries?.length > 0 ? (
            [...enquiries]
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .map((enquiry) => (
                <div 
                  key={enquiry._id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {enquiry.userID?.name?.firstName || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last updated: {moment(enquiry.updatedAt).format("DD MMM YYYY, hh:mm A")}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      enquiry.status === 'answered' 
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {enquiry.status === 'answered' ? "Answered" : "Pending"}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handleReplyClick(enquiry)}
                    variant="contained"
                    disabled={replyingTo === enquiry._id}
                    sx={{
                      backgroundColor: "#450a0a",
                      "&:hover": { backgroundColor: "#7f1d1d" },
                    }}
                  >
                    Reply
                  </Button>
                </div>
              ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              No enquiries to display
            </div>
          )}
        </div>
      </div>

      {selectedEnquiry && (
        <EnquiryPopup
          isOpen={Boolean(selectedEnquiry)}
          onClose={handlePopupClose}
          user={{ ...user, role: 'admin' }}
          selectedEnquiry={selectedEnquiry}
        />
      )}
    </div>
  );
};

export default AdminEnquiries;
