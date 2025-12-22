import jwt from "jsonwebtoken";

export const refreshTokenDecoder = (req) => {
  if (!req?.cookies?.refreshToken) return null;
  const token = req.cookies.refreshToken;
  const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  const id = decode.id;
  return id;
};
