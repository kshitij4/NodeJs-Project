const mongoose = require("mongoose");

mongoose
	.connect(process.env.DB_PATH, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log("Connected to Database...");
	})
	.catch((err) => {
		console.log(err);
	});
