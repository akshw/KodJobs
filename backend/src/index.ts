import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

app.get("/health-check", async(req, res) => {
  res.send("healthy");
});

app.get("/signup", async(req, res) =>{
  const reqBody = req.body
  if(!reqBody){
    console.log("error while signing up")
    return res.status(411).json({
      msg:"incorrect inputs"
    })
  }
// const existingUser = await findOne

// if(existingUser){
//   return res.status(411).json({
//     msg: "email alredy exists"
//   })
// }

// const user = createuser 
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
