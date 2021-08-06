const mongoose = require("mongoose");

mongoose
	.connect(process.env.DB_PATH, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to Database...");
	})
	.catch((err) => {
		console.log(err);
	});
