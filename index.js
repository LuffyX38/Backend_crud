const app = require("./app");
const connectDB = require("./src/db/DB");

connectDB()
  .then(() => {
    app.on("error", () => {
      console.log("error connecting to the database");
      process.exit(1);
    });

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("error connecting to the databse ** ** ", err);
  });
