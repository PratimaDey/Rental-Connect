import React from 'react';
import { useNavigate } from 'react-router-dom';
import UpdateProfileForm from '../components/UpdateProfileForm'; // This path should be correct based on your folder structure

/**
 * A dedicated page component to display the UpdateProfileForm.
 * This component handles page-level logic, such as navigation.
 */
export default function UpdateProfilePage() {
  const navigate = useNavigate();

  // This function is passed to the form's `onClose` prop.
  // It navigates the user back to the previous page (e.g., the dashboard).
  const handleClose = () => {
    navigate(-1); // Go back one step in the browser's history
  };

  return (
    <div>
      <UpdateProfileForm onClose={handleClose} />
    </div>
  );
}