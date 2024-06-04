import React, { type FC } from 'react';
import {
  Navigate,
  // type RouteProps,
} from "react-router-dom";

import { CurrentUserContext } from '../../context/CurrentUserContext';

interface IProtectedRouteProps {
  // children?: React.ReactNode;
  children: JSX.Element | null;
}

const ProtectedRoute: FC<IProtectedRouteProps> = (props) => {
  const { children } = props;
  const currentUser = React.useContext(CurrentUserContext);
  return currentUser ? children : <Navigate to="/signin" />
};

export default ProtectedRoute;