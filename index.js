const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');

const dotenv= require('dotenv');
const app =express();
app.use(express.static('pages'));

dotenv.config();

const port = process.env.PORT || 3000;

const username  = process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;


mongoose.connect("mongodb+srv://smitlodhiya1110:Smitlodhiya1110@cluster0.sofqnoh.mongodb.net/registrationFormDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

const registerSchema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password:String

})

const registration = mongoose.model("Registration", registerSchema);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());




app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
})


app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await registration.findOne({ email: email });
        if (!existingUser) {
            const registrationData = new registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        } else {
            console.log("User already exist");
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})
app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
})

app.listen(port,()=>{
    console.log("server is running");
})








