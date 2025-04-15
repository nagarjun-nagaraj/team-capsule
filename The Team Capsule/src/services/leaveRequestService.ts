
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export type LeaveRequest = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestedOn: Date;
  isWorkFromHome?: boolean;
  managerComment?: string;
};

// Function to load requests from localStorage
const loadRequests = (): LeaveRequest[] => {
  const savedRequests = localStorage.getItem('leaveRequests');
  if (!savedRequests) return [];
  
  try {
    // Convert string dates back to Date objects
    return JSON.parse(savedRequests, (key, value) => {
      if (key === 'startDate' || key === 'endDate' || key === 'requestedOn') {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    console.error('Error loading leave requests:', error);
    return [];
  }
};

// Function to save requests to localStorage
const saveRequests = (requests: LeaveRequest[]) => {
  localStorage.setItem('leaveRequests', JSON.stringify(requests));
};

// Initialize with data from localStorage
let leaveRequests = loadRequests();

export const useLeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      // Load the latest requests from localStorage
      const allRequests = loadRequests();
      
      // Filter for current user
      const userRequests = allRequests.filter(
        req => req.userId === currentUser.uid
      );
      
      setRequests(userRequests);
    }
  }, [currentUser]); 
  
  return { requests };
};

export const useAllLeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  
  useEffect(() => {
    // Load all requests from localStorage
    const allRequests = loadRequests();
    setRequests(allRequests);
    
    // Set up listener for storage events (for multi-tab support)
    const handleStorageChange = () => {
      setRequests(loadRequests());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return { requests };
};

export const addLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'requestedOn'>) => {
  const newRequest: LeaveRequest = {
    ...request,
    id: Date.now().toString(),
    requestedOn: new Date(),
  };
  
  // Load latest requests, add new one, and save back
  const currentRequests = loadRequests();
  const updatedRequests = [...currentRequests, newRequest];
  
  leaveRequests = updatedRequests;
  saveRequests(updatedRequests);
  
  // Trigger storage event for other tabs
  window.dispatchEvent(new Event('storage'));
  
  return newRequest;
};

export const updateLeaveRequestStatus = (
  requestId: string, 
  status: "approved" | "rejected", 
  managerComment?: string
) => {
  // Load latest data
  const currentRequests = loadRequests();
  
  // Update the specific request
  const updatedRequests = currentRequests.map(req => 
    req.id === requestId 
      ? { ...req, status, managerComment } 
      : req
  );
  
  leaveRequests = updatedRequests;
  saveRequests(updatedRequests);
  
  // Trigger storage event for other tabs
  window.dispatchEvent(new Event('storage'));
  
  return updatedRequests.find(req => req.id === requestId);
};
