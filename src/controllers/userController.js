import UserService from "../services/userService.js";

class UserController {
  async register(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({
        message:
          "User created successfully. Please verify your email to activate your account.",
        user,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { token, user } = await UserService.loginUser(req.body);
      res.json({ token, user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await UserService.getUserById(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const user = await UserService.updateUser(req.user.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      await UserService.verifyEmail(token);
      res.status(200).json({
        message: "Email verified successfully. You can now log in.",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();
