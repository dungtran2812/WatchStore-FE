import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoleBasedRoute  = (props) => {
	const { path, Component } = props;
	const accessToken = useSelector(state => state?.rootReducer?.user?.accessToken)
	let isAdmin = false;
	if (accessToken) {
    const decodedToken = jwtDecode(accessToken); // Decode the token
    isAdmin = decodedToken.isAdmin; // Get isAdmin from the decoded token
  }
	// Should replace by get user role (from storage, redux store or anything...) localStorage || cookies
	// Check user role with route's required roles
	const canAccessWithRoles = isAdmin;
	// Send navigate state, included last path
	const routingState = {
		requestedPath: path,
	};

	return canAccessWithRoles ? <Component /> : <Navigate to='/' state={routingState} />;
};


export default PrivateRoleBasedRoute;
