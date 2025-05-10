import { ReactNode } from 'react';

declare module 'react-router-dom' {
    export interface RouteProps {
        path?: string;
        element?: ReactNode;
        children?: ReactNode;
    }

    export interface RoutesProps {
        children?: ReactNode;
        location?: string;
    }

    export const BrowserRouter: React.FC<{ children?: ReactNode }>;
    export const Routes: React.FC<RoutesProps>;
    export const Route: React.FC<RouteProps>;
} 