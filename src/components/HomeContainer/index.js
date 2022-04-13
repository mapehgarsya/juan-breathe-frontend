import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import HomeNav from '../HomeNav';
import Sidebar from '../SideBar';
import ResetPassword from '../../pages/Login/utils/ResetPassword';
// services
import { loginAdmin } from '../../services/auth/login';

export default function HomeContainer (props) {
  // set up password and new password variables
  const [userName, setUserName] = useState('');
  const [showNextStep, setShowNextStep] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState([])
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // modal show and hide
  const handleCloseShowResetModal = () => setShowResetModal(false);

  // add reset method
  const handleConfirmCurrentPassword = async () => {
    setIsSubmitting(!isSubmitting)
    try {
      const { data } = await loginAdmin({ username: userName, password: currentPassword });
      if(data.success) {
        setShowNextStep(!showNextStep)
        setErrorMsg([]);
        setIsSubmitting(false)
      }
    } catch (error) {
      setIsSubmitting(false)
      if(error.response?.status === 400) {
        setErrorMsg([error.response.data?.message])
      }
    }
  }

  useEffect(() => {
    try {
      // get the local token, decode and reuse the users user name as navbar header
      const token = localStorage.getItem('accessToken');
      const decodedToken = token ? jwtDecode(token) : null
      
      if(decodedToken) {
        setUserName(decodedToken.username)
      }
    } catch (error) {
        setUserName('JuanBreath Admin')   
    }
  },[]);

  // add toast notif
  return (
    <div className='customContainer '>
        <div className='homeWrapper'>
            <Sidebar />
            <div className='navAndContentDiv'>
                <HomeNav 
                  showResetPasswordModal={e => setShowResetModal(!showResetModal)}
                />
                <div className='contentWrapper'>
                    {props.children}
                </div>
            </div>
        </div>
        <ResetPassword
          showFunction = {showResetModal}
          showNextStep={showNextStep}
          errorMsg={errorMsg}
          onHideFunction = {handleCloseShowResetModal}
          handleConfirmCurrentPassword={handleConfirmCurrentPassword}
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmNewPassword={confirmNewPassword}
          setCurrentPassword={setCurrentPassword}
          setNewPassword={setNewPassword}
          setConfirmNewPassword={setConfirmNewPassword}
          isSubmitting={isSubmitting}
        />
    </div>
  )
}

