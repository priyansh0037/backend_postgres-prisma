import express, { urlencoded } from "express"
import fileUpload from "express-fileupload";
import "dotenv/config"
import router from "./routes/route.js";

const app = express()
const Port = process.env.PORT || 8000;

// middlewaqres

app.use(express.json())
app.use(urlencoded({extended:false}))
app.use(fileUpload())

// import route

app.use("/api",router)

app.get("/", (req, res) => {
    return res.send("Hello World")
})

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`)
})