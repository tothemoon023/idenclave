import React from 'react';
import { RouteObject } from 'react-router-dom';
import VerificationPage from './pages/verification';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <VerificationPage />,
    },
    {
        path: '/verification',
        element: <VerificationPage />,
    },
]; 