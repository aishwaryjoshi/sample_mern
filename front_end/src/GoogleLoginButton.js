import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
const GoogleLoginButton = ({ onSuccess, onFailure }) => {
    const handleGoogleLoginSuccess = (response) => {
        // Handle successful login
        onSuccess(response);
    };

    const handleGoogleLoginFailure = (response) => {
        // Handle failed login
        onFailure(response);
    };

    return (
        <GoogleLogin
            text="Login with Google"
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
            promptMomentNotification={"hello"}
        />
    );
};

export default GoogleLoginButton;
