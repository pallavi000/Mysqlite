# Mysqlite

Straightforward query-based solution to model your application data in sql DB.


## Usage/Examples

```javascript
async function test() {

  await MySql.connect({
    host: "localhost",
    user: "root",
    database: "database name",
    port: 3306,
    password: "",
    synchronize: false,
  });

  //Schema
  const userSchema = MySql.Schema({
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: true },
  });

//Example
  const User = await MySql.model("User", userSchema);
 
  const data={
      username:"example",
      email:"example@gmail.com",
      password:"123456",
  }

  const result = await User.find();
  const result = await User.findById(1)
  const result = await User.create(data)
  const result = await User.findByIdAndUpdate(1,data)
```
}
test()

