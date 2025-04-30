import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import {
  createEnquiry,
  getUserEnquiries,
  respondToEnquiry,
  updateSelectedEnquiry,
  clearConversation as clearConversationAction,
  getAllEnquiries
} from "../store/slices/enquirySlice";
import {
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from '../utils/axios.js';
import { useNavigate } from 'react-router-dom';

const EnquiryPopup = ({ isOpen, onClose, user, selectedEnquiry = null }) => {
  const dispatch = useDispatch();
  const { enquiries, loading, error, currentEnquiry } = useSelector((state) => state.enquiry);
  const navigate = useNavigate();
  
  // Use currentEnquiry if available, otherwise fall back to selectedEnquiry
  const displayEnquiry = currentEnquiry || selectedEnquiry;

  const [message, setMessage] = useState("");
  const [replyingToIndex, setReplyingToIndex] = useState(null);

  const isAdmin = user?.role === "admin";

  // Remove polling effect for admin view since we're showing single chat
  useEffect(() => {
    const fetchEnquiries = async () => {
      if (isOpen && user && !isAdmin && !selectedEnquiry) {
        try {
          await dispatch(getUserEnquiries()).unwrap();
        } catch (err) {
          console.error('Failed to fetch enquiries:', err);
        }
      }
    };

    let interval;
    if (isOpen && user && !isAdmin && !selectedEnquiry) {
      fetchEnquiries();
      interval = setInterval(fetchEnquiries, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [dispatch, isOpen, user, isAdmin, selectedEnquiry]);

  // First, add a useEffect to keep track of selectedEnquiry updates
  useEffect(() => {
    if (isAdmin && selectedEnquiry?._id) {
      const fetchLatestEnquiry = async () => {
        try {
          const { data } = await api.get(`/admin/getUserQuery/${selectedEnquiry._id}`);
          dispatch(updateSelectedEnquiry(data));
        } catch (err) {
          console.error('Failed to fetch updated enquiry:', err);
        }
      };
      fetchLatestEnquiry();
    }
  }, [isAdmin, selectedEnquiry?._id, dispatch]);

  if (!isOpen) return null;

  // Update the handleSendEnquiry function
  const handleSendEnquiry = async () => {
    if (!message.trim()) return;

    try {
      if (isAdmin && selectedEnquiry) {
        const messageToSend = message.trim();
        const responseIndex = replyingToIndex !== null ? replyingToIndex : selectedEnquiry.query.length - 1;
        
        // Clear message input and reset reply index immediately
        setMessage("");
        setReplyingToIndex(null);

        // Send response to server
        await dispatch(respondToEnquiry({
          enquiryId: selectedEnquiry._id,
          response: messageToSend,
          responseIndex
        })).unwrap();

        // Fetch latest enquiry data to update the chat
        const { data } = await api.get(`/admin/getUserQuery/${selectedEnquiry._id}`);
        dispatch(updateSelectedEnquiry(data));

      } else {
        // Handle user enquiry
        await dispatch(createEnquiry({
          query: message.trim()
        })).unwrap();
        dispatch(getUserEnquiries());
        setMessage("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const renderEnquiry = (enquiry) => {
    // Create an array of messages combining queries and responses
    const messages = enquiry.query.map((q, index) => ({
      type: 'query',
      content: q,
      index: index
    })).reduce((acc, curr, idx) => {
      acc.push(curr);
      if (enquiry.response && enquiry.response[idx]) {
        acc.push({
          type: 'response',
          content: enquiry.response[idx],
          index: idx
        });
      }
      return acc;
    }, []);
  
    return (
      <div key={enquiry._id} className="space-y-3">
        <div className="flex flex-col gap-2">
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col gap-1">
              {message.type === 'query' ? (
                <>
                  <div className="flex justify-end">
                    <div className="bg-blue-100 text-gray-800 rounded-lg rounded-tr-none p-3 max-w-[80%]">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                  {isAdmin && (!enquiry.response?.[message.index] || enquiry.response[message.index] === null) && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => setReplyingToIndex(message.index)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Reply to this
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
  
        {replyingToIndex !== null && (
          <div className="text-xs text-blue-600 italic text-center">
            Replying to message #{replyingToIndex + 1}
            <button
              onClick={() => setReplyingToIndex(null)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  };

  // First, add the clearConversation function before the return statement
  const handleClearConversation = async () => {
    try {
      if (selectedEnquiry?._id) {
        await dispatch(clearConversationAction(selectedEnquiry._id)).unwrap();
        
        // Optionally refresh the enquiries list if in admin view
        if (isAdmin) {
          dispatch(getAllEnquiries());
        }
      }
    } catch (err) {
      console.error("Failed to clear conversation:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <DialogTitle className="bg-blue-950 text-blue-50 flex justify-between items-center">
          <span>{isAdmin ? `Chat with ${selectedEnquiry?.userID?.name?.firstName || 'User'}` : "Send Enquiry"}</span>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleClearConversation}
              variant="text"
              size="small"
              sx={{
                color: "#fff",
                fontSize: "0.75rem",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" }
              }}
            >
              Clear Chat
            </Button>
            <IconButton onClick={onClose} className="text-blue-50">
              <CloseIcon className="text-blue-50" />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent className="bg-white h-[500px] flex flex-col">
          {error && (
            <div className="bg-blue-100 text-blue-700 p-3 rounded mb-3">
              {error}
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
              </div>
            ) : isAdmin && displayEnquiry ? (
              <div className="space-y-6">
                {renderEnquiry(displayEnquiry)}
              </div>
            ) : enquiries?.length > 0 ? (
              <div className="space-y-6">
                {enquiries.map(renderEnquiry)}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-4">
                Start a conversation
              </div>
            )}
          </div>

          {/* Message Input - Now visible for both admin and user */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <TextField
                fullWidth
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendEnquiry();
                  }
                }}
              />
              <Button
                onClick={handleSendEnquiry}
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: "#450a0a",
                  "&:hover": { backgroundColor: "#7f1d1d" },
                  minWidth: "auto",
                  padding: "8px 16px"
                }}
              >
                {loading ? "..." : "Send"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </div>
    </div>
  );
};

EnquiryPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
  selectedEnquiry: PropTypes.object // Add this prop type
};

export default EnquiryPopup;
