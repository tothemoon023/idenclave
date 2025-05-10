import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import VerificationPage from './pages/verification';
import IssuancePage from './pages/issuance';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <VerificationPage />,
    },
    {
        path: '/verification',
        element: <VerificationPage />,
    },
    {
        path: '/issuance',
        element: <IssuancePage />,
    },
]); 