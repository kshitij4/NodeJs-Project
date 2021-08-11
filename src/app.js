require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const Musical = require("./Models/musical");
const bcrypt = require("bcryptjs");
require("./Database/conn");
const auth = require("./middleware/authenticate");

const app = express();
const port = process.env.PORT || 8000;

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../Templates/views");
const partialsPath = path.join(__dirname, "../Templates/partials");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);

app.use(express.static(staticPath));

app.get("/", (req, res) => {
	res.render("index");
});

app.get("/signup", (req, res) => {
	res.render("signup");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.get("/profile", auth, (req, res) => {
	res.render("profile", {
		user: req.user,
	});
});

app.get("/logedin", auth, (req, res) => {
	res.render("logedin");
});

app.get("/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((curr) => {
			return curr.token !== req.token;
		});
		res.clearCookie("jwt");
		console.log("Logged out Successfully!!");
		await req.user.save();
		res.redirect("login");
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post("/signup", async (req, res) => {
	try {
		const pass = req.body.pass;
		const cpass = req.body.cpass;
		if (pass === cpass) {
			const registerMusical = new Musical({
				firstname: req.body.fname,
				lastname: req.body.lname,
				email: req.body.email,
				gender: req.body.gender,
				phone: req.body.phone,
				age: req.body.age,
				password: req.body.pass,
			});
			const token = await registerMusical.generateToken();

			res.cookie("jwt", token, {
				maxAge: 500000,
				httpOnly: true,
				// secure: true
			});

			const data = await registerMusical.save();
			res.status(201).render("index");
		} else {
			res.send("Password do not match");
		}
	} catch (error) {
		res.status(404).send(error);
	}
});

app.post("/login", async (req, res) => {
	try {
		const email = req.body.email;
		const pass = req.body.pass;
		const musicalData = await Musical.findOne({ email });
		const isMatch = await bcrypt.compare(pass, musicalData.password);
		if (isMatch) {			
			const token = await musicalData.generateToken();
			res.cookie("jwt", token, {
				maxAge: 5000000,
				httpOnly: true,
				// secure: true
			});
			res.status(201).render("logedin");
		} else {
			res.status(400).send("Password Incorrect!!");
		}
	} catch (error) {
		res.status(400).send("Email Does not Exist!!");
	}
});

app.get("*", (req, res) => {
	res.render("errorPage", {
		errorCode: "404 Error",
		errorMsg: "Page Not Found",
	});
});

app.listen(port, () => {
	console.log(`Listening to ${port} port`);
});
