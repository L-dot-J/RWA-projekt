const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Token } = require('./login.model');

const ACCESS_TOKEN_EXPIRES_IN = 5 * 60;
const REFRESH_TOKEN_EXPIRES_IN = 24 * 60 * 60;
const JWT_SECRET = process.env.JWT_SECRET;

async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            res.set({ "WWW-Authenticate": "Bearer" })
            res.status(401).send({ message: "Invalid username or password" });
            return;
        }
        const payload = {}
        const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN, subject: user._id.toString() });
        const refresh_token = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN, subject: user._id.toString() });

        const db_token = await Token({ refresh_token });
        await db_token.save();

        res.status(200).json({
            message: "Authentication successful",
            access_token,
            refresh_token,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "An error occurred during the login process" });
    }
}

async function logout(req, res) {
    const [bearer, refresh_token] = req.headers.authorization?.split(" ") || [];
    if (bearer !== "Bearer") {
        return res.set({ "WWW-Authenticate": "Bearer" }).status(403).send({ message: "Invalid credentials" });
    }
    try {
        if (!jwt.verify(refresh_token, JWT_SECRET)) {
            return res.set({ "WWW-Authenticate": "Bearer" }).status(403).send({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).send({ message: "Invalid or expired token" });
    }

    try {
        const deleted_token = await Token.findOneAndDelete({ refresh_token })
        if (!deleted_token) {
            res.status(404).send({ message: "Token is not Found!" });
            return;
        }
        res.status(200).send({
            message: "Token deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting a token", error);
        res.status(500).send({ message: "Failed to delete a token" });
    }
}

async function refreshToken(req, res) {
    const [bearer, refresh_token] = req.headers.authorization?.split(" ") || [];
    if (bearer !== "Bearer") {
        return res.set({ "WWW-Authenticate": "Bearer" }).status(403).send({ message: "Invalid credentials" });
    }
    try {

        if (!jwt.verify(refresh_token, JWT_SECRET)) {
            return res.set({ "WWW-Authenticate": "Bearer" }).status(403).send({ message: "Invalid credentials" });
        }
        const db_token = await Token.find({ refresh_token });
        if (!db_token) {
            return res.set({ "WWW-Authenticate": "Bearer" }).status(403).send({ message: "Invalid credentials" });
        }
        await Token.findOneAndDelete({ refresh_token });
        const user = jwt.decode(refresh_token);
        const db_user = await User.findById(user.sub);
        if (!db_user) {
            return res.set({ "WWW-Authenticate": "Bearer" }).status(403).send({ message: "Invalid credentials" });
        }


        const access_token = jwt.sign({}, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN, subject: db_user._id.toString() });
        const new_refresh_token = jwt.sign({}, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN, subject: db_user._id.toString() });
        const new_db_token = await Token({ refresh_token: new_refresh_token });
        await new_db_token.save();

        res.status(200).json({
            message: "Tokens created successful",
            access_token,
            new_refresh_token,
        });
    } catch {
        console.log(error);
        return res.status(500).send({ message: "An error occurred while processing the request" });

    }
}

module.exports = {
    login,
    refreshToken,
    logout
}