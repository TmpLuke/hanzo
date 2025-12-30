export const getAdminToken = () => {
  return sessionStorage.getItem("adminToken");
};

export const isAdminAuthenticated = () => {
  const token = sessionStorage.getItem("adminToken");
  const expiry = sessionStorage.getItem("adminTokenExpiry");
  
  if (!token || !expiry) return false;
  return Date.now() <= parseInt(expiry);
};

export const logoutAdmin = async () => {
  const token = getAdminToken();
  
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  sessionStorage.removeItem("adminToken");
  sessionStorage.removeItem("adminTokenExpiry");
};

export const logoutAllSessions = async (password: string) => {
  try {
    const response = await fetch('/api/admin/logout-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    
    if (response.ok) {
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminTokenExpiry");
      return true;
    }
    return false;
  } catch (error) {
    console.error('Logout all error:', error);
    return false;
  }
};

export const getAuthHeaders = () => {
  const token = getAdminToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
