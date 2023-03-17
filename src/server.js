// mongodb+srv://gavish:GDx26RLpdBmEAL2x@cluster0.elurlmb.mongodb.net/?retryWrites=true&w=majority
// GDx26RLpdBmEAL2x

const express = require('express')
const cors = require('cors')
const userRoutes = require("./routes/user.routes")
const bodyParser = require('body-parser');

const app = express();
require("dotenv").config();
require("./db/connection")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const PORT = process.env.PORT || 8000;

//middleware
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))

//aplication routes
app.use("/api/auth", userRoutes)

app.listen(PORT, () => {
    console.log("\x1b[33m%s\x1b[0m", `server started at port ${PORT}`)
})