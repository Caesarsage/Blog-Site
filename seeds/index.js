const {places, descriptors  } = require('./seedHelpers');
const mongoose = require('mongoose');

const Blog = require('../models/blogModel');

mongoose.connect('mongodb://localhost:27017/blog-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected correctly");
});


const random = x => x[Math.floor(Math.random() * x.length)];

const seedDB = async ()=>{
  await Blog.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const blog = new Blog({
      title: `${random(descriptors)} ${random(places)}`,
      capture: "Introduction to Frontend Technologies",
      content: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium optio molestiae ipsa eligendi expedita suscipit libero repudiandae animi ratione possimus a incidunt, recusandae sapiente placeat perspiciatis architecto. Alias, esse qui!L Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur, praesentium necessitatibus asperiores similique aliquid quis dicta reiciendis in voluptatibus animi, vitae non perspiciatis ex facere, aliquam et quas molestiae odit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus maxime quia suscipit enim, aliquam quisquam vel beatae dolorum pariatur expedita hic ratione nihil perspiciatis repudiandae ea voluptas facere obcaecati tenetur." ,
      image: "https://images.unsplash.com/photo-1502489743911-88606f93ba47?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9",
      author: "5fca67924cfc49179c1cf1de"
    });
    await blog.save()
  }
}

seedDB().then(()=>{
  mongoose.connection.close()
})