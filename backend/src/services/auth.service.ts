import crypto from "crypto";

class AuthService {
  // Mock in-memory stores
  private users = new Map<string, any>();
  private tokens = new Map<string, string>(); // token -> userId

  async register(payload: any) {
    const id = crypto.randomUUID();
    const user = { id, ...payload, createdAt: new Date().toISOString() };
    this.users.set(id, user);
    return { id, email: payload.email };
  }

  async login({ email, password }: { email: string; password: string }) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        // NOTE: replace with bcrypt compare in real app
        const token = crypto.randomBytes(24).toString("hex");
        this.tokens.set(token, user.id);
        return { token, user: { id: user.id, email: user.email } };
      }
    }
    throw new Error("Invalid credentials");
  }

  async logout(userOrBody: any) {
    // Remove tokens belonging to user (mock)
    if (!userOrBody) return;
    const userId = userOrBody.id || userOrBody.userId;
    for (const [t, uid] of this.tokens.entries()) {
      if (uid === userId) this.tokens.delete(t);
    }
  }

  async refreshToken(refreshToken: string) {
    const userId = this.tokens.get(refreshToken);
    if (!userId) throw new Error("Invalid refresh token");
    const newToken = crypto.randomBytes(24).toString("hex");
    this.tokens.set(newToken, userId);
    return { token: newToken };
  }

  async forgotPassword(email: string) {
    // find user and create reset token
    const user = Array.from(this.users.values()).find(
      (u: any) => u.email === email
    );
    if (!user) throw new Error("User not found");
    const token = crypto.randomBytes(16).toString("hex");
    // store token (in production use TTL store)
    user.resetToken = token;
    return token;
  }

  async resetPassword(token: string, newPassword: string) {
    const user = Array.from(this.users.values()).find(
      (u: any) => u.resetToken === token
    );
    if (!user) throw new Error("Invalid token");
    user.password = newPassword; // hash in real app
    delete user.resetToken;
  }

  async verifyEmail(token: string) {
    // mock verify token
    const user = Array.from(this.users.values()).find(
      (u: any) => u.verifyToken === token
    );
    if (!user) throw new Error("Invalid token");
    user.emailVerified = true;
  }
}

export const authService = new AuthService();
