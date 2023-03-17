const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => {
    console.log("\x1b[32m%s\x1b[0m", "Database Connection Established")
})
.catch((error) => {
    console.log("Error occured while connecting to the database")
    console.log(error)
})