// utils/jwtUtils.js
export const parseJWT = (token) => {
  if (!token) return null;
  
  try {
    // JWT由三部分组成，用点分隔：Header.Payload.Signature
    // 我们只需要Payload部分（第二部分）
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('解析JWT失败:', error);
    return null;
  }
};