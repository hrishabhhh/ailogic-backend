import { Request, Response, NextFunction } from "express";
import redis from "../lib/redis";

export async function loginRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ip = req.ip;
    const key = `login_attempts:${ip}`;

    const attempts = await redis.incr(key);

    if (attempts === 1) {
      await redis.expire(key, 60);
    }

    if (attempts > 5) {
      const ttl = await redis.ttl(key);

      return res.status(429).json({
        message: "Too many login attempts. Please try again later.",
        retryAfter: ttl,
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter unavailable:", error);

    next();
  }
}
