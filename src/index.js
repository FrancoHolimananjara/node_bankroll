const app = require("../src/server/app");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));