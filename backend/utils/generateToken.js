import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  const cookieExpiryDays = Number(process.env.JWT_COOKIE_EXPIRES_DAYS) || 7;

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: cookieExpiryDays * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
