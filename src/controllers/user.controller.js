const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

//to register the user
module.exports.register = async (req, res, next) => {
	try {
		//encrypt the password
		req.body.password = bcrypt.hashSync(req.body.password, 8);

		//add the user
		const { firstName, lastName, email, password } = req.body;
		const newUser = new UserModel({ firstName, lastName, email, password });
		const result = await newUser.save();

		//remove password from response
		delete result["_doc"]["password"];

		//generate token and set is as cookie on user
		const token = await newUser.generateAuthToken();
		res.cookie(`chatspace_cred`, token, {
			expires: new Date(Date.now() + 1200000),
		});
		//finally send 201 response
		console.log(
			"\x1b[36m%s\x1b[0m",
			`new user registered ${result["_doc"]["_id"]}`
		);
		res.status(201).send(result);
	} catch (error) {
		console.log(error);

		//not unique email or username
		if (error.code == 11000) {
			res.status(400).send(`Enter unique ${Object.keys(error.keyPattern)}`);
		}

		//invalid email address entered
		else if (
			error.message ==
			"Users validation failed: email: Email entered is not a valid email"
		) {
			res.status(400).send("Enter a valid email address");
		}

		// if any other error
		else res.status(500).send(error);
		next();
	}
};

//user logins the website
module.exports.login = async (req, res, next) => {
	try {
		//get user credentials
		const { email, password } = req.query;

		//find user with email
		const user = await UserModel.findOne({ email: { $eq: email } });
		//check password
		if (user) {
			const isMatch = await bcrypt.compare(password, user.password);
			if (isMatch) {
				const token = await user.generateAuthToken();
				res.cookie(`chatspace_cred`, token, {
					expires: new Date(Date.now() + 1200000),
				});

				Object.keys(user).forEach((key) => {
					delete user["_doc"]["password"];
					delete user["_doc"]["tokens"];
					delete user["_doc"]["__v"];
				});
				console.log("\x1b[33m%s\x1b[0m", `userlogin ${user["_doc"]["_id"]}`);
				res.status(200).send(user);
				return;
			} else {
				console.log("Invalid Details");
				res.status(400).send("Invalid Credentials");
				return;
			}
		} else {
			console.log("Invalid Details");
			res.status(400).send("Invalid Credentials");
			return;
		}
	} catch (error) {
		console.log("Login Controller Error => ", error);
		// if any  error
		res.status(500).send(error);
		next();
	}
};