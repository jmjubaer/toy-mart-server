const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
    res.send("Jm toy hub server running at http://localhost:5000")
})


app.listen(port,() => {
    console.log("JM toy hub running on port " + port);
});