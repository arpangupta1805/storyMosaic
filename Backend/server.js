const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require('cors');
require("dotenv").config();


dotenv.config();



const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = process.env.JWT_SECRET_KEY;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));





app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from frontend
  credentials: true // Allow cookies and authorization headers
}));


app.get("/", (req, res) => {
  res.send("Hello Worldji!");
});

app.post("/api/register", async(req, res) => {
    const {name, username, password } = req.body;
    const registerAction = await registerUser(name, username, password);
    res.send({message: registerAction});

});

app.post("/api/login", async(req, res) => {
  const { username, password } = req.body;
  const loginAction = await loginUser(username, password);
  res.send(loginAction);
});

app.get("/api/authenticate", async(req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const decoded = jwt.verify(token, secretKey);
  res.send(decoded);
});

app.get("/api/user/:username/stories", async (req, res) => {
  const { username } = req.params;
  console.log(username)
  try {
    const user = await User.findOne({ username: username }); // Assuming you have a User model
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const storyList = await Story.find({author: username});

    res.json(storyList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



app.get("/api/stories/:storyId", async (req, res) => {
    const { storyId } = req.params;
    console.log(storyId)
    try {
      const story = await Story.findOne({ storyId: storyId });
      if (!story) {
        console.log(storyId);
        return res.status(404).json({ message: "Story not found" });
      } else {
        res.json(story);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }

});

app.get("/api/pull-requests/:storyId", (req, res) => {
  const { storyId } = req.params;
  res.json(getPullRequests(storyId));
});

app.get("/api/most-popular-stories/:number", async (req, res) => {
  try {
    const numberOfStories = parseInt(req.params.number);

    if (isNaN(numberOfStories) || numberOfStories <= 0) {
      return res.status(400).json({ message: "Invalid number of stories requested" });
    }

    const stories = await Story.find({})
      .sort({ likes: -1 })
      .limit(numberOfStories)
      .exec();

    if (stories.length === 0) {
      return res.status(404).json({ message: "No stories found" });
    }

    res.json(stories);
  } catch (err) {
    console.error("Error fetching stories:", err);
    res.status(500).json({ error: "An error occurred while fetching the most popular stories" });
  }
});

app.get("/api/compare-stories", async (req, res) => {
  const { storyId1, storyId2 } = req.query;
  try {
    const story1 = await getStory(storyId1);
    const story2 = await getStory(storyId2);
    if (story1 && story2) {
      const diff = compareStrings(story1.content, story2.content);
      res.json({ diff });
    } else {
      res.status(404).json({ message: "Stories not found" });
    }
  } catch (err) {
    console.error("Error fetching stories:", err);
    res.status(500).json({ error: "An error occurred while fetching the most popular stories" });
  }
});


app.post("/api/create-story", authenticate, async (req, res) => {
    const { title, description, content, author, sourceStory} = req.body;
    console.log(req.body);
    const storyAction = await createStory(title, description, content, author, sourceStory);
    res.send({message: storyAction});
});



app.post("/api/edit-story", authenticate, async (req, res) => {
    const  { title, description, content, username, storyId } = req.body;
    console.log(req.body);
    const editAction = await editStory(title, description, content, username, storyId);
    res.send({message: editAction});
})

app.post("/api/add-editor", authenticate, async (req, res) => {
  const { storyId, author, username } = req.body;
  console.log(req.body);

  try {
    const message = await addEditor(storyId, author, username);
    res.json({ message }); // Send a proper JSON response
  } catch (error) {
    console.error("Error adding editor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.post("/api/remove-editor", authenticate, async (req, res) => {
  const { storyId, username, author } = req.body;
  console.log(req.body);

  try {
    const message = await removeEditor(storyId, username, author);
    res.json({ message }); // Send a proper JSON response
  } catch (error) {
    console.error("Error removing editor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



app.post("/api/create-fan-fiction", authenticate, async (req, res) => {
    const { storyId, username } = req.body;
    console.log(req.body);
    const fanFictionAction = await createFanFiction(storyId, username);
    res.send({message: fanFictionAction});
});

app.get("/api/fan-fiction/:storyId", async (req, res) => {
  const { storyId } = req.params;

  try {
    const fanFictions = await Story.find({ sourceStory: storyId });

    if (!fanFictions || fanFictions.length === 0) {
      return res.status(404).json({ message: "No fan fictions found", data: [] });
    }

    res.json(fanFictions);
  } catch (err) {
    console.error("Error fetching fan fictions:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


app.post("/api/delete-story", authenticate, async (req, res) => {
  const { storyId } = req.body;
  console.log(storyId);
  await Story.findOneAndDelete({ storyId })
    .then((story) => {
      if (story) {
        if (User.findOne({username}).username === story.author) {
          res.send({message: "Story deleted successfully"});
        } else {
          res.send({message: "You are not the author of this story"});
        }
      } else {
        res.send({message: "Story not found"});
      }
    })
    .catch((err) => console.log(err));
});

app.post("/api/create-pull-request", authenticate, async (req, res) => {
    const { storyId, username } = req.body;
    console.log(req.body);
    const pullRequestAction = await createPullRequest(storyId, username);
    res.send({message: pullRequestAction});
});

app.post("/api/change-pull-request-status", authenticate, async (req, res) => {
  const { pullRequestId, status, username } = req.body;
  const pullRequestStatusAction = await changePullRequestStatus(pullRequestId, status, username);
  res.send({message: pullRequestStatusAction});
});

app.post("/api/story/click-like", authenticate, async (req, res) => {
  const { storyId, username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const story = await Story.findOne({ storyId });
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (user.liked_stories.includes(storyId)) {
      // Unlike story
      user.liked_stories = user.liked_stories.filter((id) => id !== storyId);
      story.likes = Math.max(0, story.likes - 1); // Prevent negative likes
      await user.save();
      await story.save();
      return res.json({ message: "Story unliked successfully", liked: false, likes: story.likes });
    } else {
      // Like story
      user.liked_stories.push(storyId);
      story.likes++;
      await user.save();
      await story.save();
      return res.json({ message: "Story liked successfully", liked: true, likes: story.likes });
    }
  } catch (error) {
    console.error("Error handling like:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});









// User things

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: { type: String, required: true},
  stories: { type: [String]},
  number_of_stories: {type: Number, default: 0},
  liked_stories: {type: [String]},
  
})

const User = mongoose.model("User", userSchema);

const saltRounds = 10;

async function registerUser(name, username, password) {
  try {
    // Check if the user already exists
    const user = await User.findOne({ username });
    if (user) {
      return "User already exists";
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new user with the hashed password
      const newUser = new User({ name, username, password: hashedPassword });
      await newUser.save();
      return "User registered successfully";
    }
  } catch (err) {
    console.log(err);
    return "Error registering user";
  }
}

async function loginUser(username, password) {
  try {
    const user = await User.findOne({ username });
    
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ 
          id: user._id, 
          username: user.username 
        }, secretKey, { expiresIn: '7200h' });

        return { message: "User logged in successfully", token };
      } else {
        return { message: "Invalid username or password" };
      }
    } else {
      return { message: "Invalid username or password" };
    }
  } catch (err) {
    console.log(err);
    return { message: "Error logging in" };
  }
}


async function addStoryToUser(username, storyId) {
  await User.findOne({ username })
    .then((user) => {
      if (user) {
        user.stories.push(storyId);
        user.number_of_stories = user.number_of_stories + 1;
        user.save();
      } else {
        throw new Error("User not found");
      }
    })
    .catch((err) => console.log(err));
}







// Story things



const storySchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true, default: "No description"},
  content: {type: String, required: true},
  author: {type: String, required: true},
  editors: {type: [String], default: []},
  likes: {type: Number, required: true, default: 0},
  date: {type: String, required: true, default: formatDate},
  storyId: {type: String, required: true, unique: true},

  sourceStory: {type: String},
  fanfiction: {type: [String], default: []},
  pullRequests: {type: [String], default: []},
  liked_users: {type: [String], default: []},
})

const Story = mongoose.model("Story", storySchema);


const pullRequestSchema = new mongoose.Schema({
  pullRequestId: {type: String, required: true, unique: true},
  from: {type: String, required: true},
  to: {type: String, required: true},
  comment: {type: String, default: ""},
  status: {type: String, required: true, default: "pending"},
  date: {type: Date, required: true, default: Date.now()}
})

const PullRequest = mongoose.model("PullRequest", pullRequestSchema);

async function createPullRequest(from, to, comment) {
  const pullRequestId = from
  await Story.findOne({storyId: from})
    .then((story) => {
      if (story) {
        if (User.findOne({username})) {
          story.pullRequests.push(pullRequestId);
          story.save();
          return "Story forked successfully";
        } else {
          return "User not found";
        }
      } else {
        throw new Error("Story not found");
      }
    })
    .catch((err) => console.log(err));
  const pullRequest = new PullRequest({pullRequestId, from, to, comment});
  pullRequest.save();
}

function getPullRequests(storyId) {
  PullRequest.find({from: storyId})
    .then((pullRequests) => {
      if (pullRequests) {
        return pullRequests;
      } else {
        throw new Error("PullRequests not found");
      }
    })
    .catch((err) => console.log(err));
}

async function changePullRequestStatus(pullRequestId, status, username) {
  await PullRequest.findOne({pullRequestId})
    .then(async (pullRequest) => {
      if (User.findOne({username})) {
        if (pullRequest) {
          if(Story.findOne({storyId: pullRequest.from}).author === username || Story.findOne({storyId: pullRequest.to}).editors.includes(username)) {
            pullRequest.status = status;
            pullRequest.save();
            return "PullRequest status changed successfully";
          } else {
            return "You are not the author or editor of this story";
          }
        } else {
          return "PullRequest not found";
        }
      } else {
        return "User not found";
      }
    });
}


async function createStory(title, description, content, author, sourceStory) {
  console.log(title);
  const storyId = title.replace(/\s+/g, "-").toLowerCase() + Date.now();
  const story = new Story({title, description, content, author, sourceStory, storyId: storyId});
  if (User.findOne({author})) {
    story.save();
    await addStoryToUser(author, story.storyId);
    return "Story created successfully";
  } else {
    return "User not found";
  }
}



async function editStory(title, description, content, username, storyId) {
  try {
    const story = await Story.findOne({ storyId }); // Wait for DB query
    if (!story) {
      throw new Error("Story not found");
    }

    if (story.editors.includes(username) || story.author === username) {
      story.title = title;
      story.description = description;
      story.content = content;
      await story.save(); // Wait for save to complete
      return "Story edited successfully"; // Return result properly
    } else {
      return "You are not the author or editor of this story";
    }
  } catch (err) {
    console.log(err);
    return "An error occurred"; // Ensure a return value on failure
  }
}

async function addEditor(storyId, author, username) {
  try {
    console.log(author, username, storyId);

    const story = await Story.findOne({ storyId });

    if (!story) {
      return "Story not found";
    }

    console.log("Story Author:", story.author, "Requesting Author:", author);

    // Check if the requester is the author
    if (story.author === author) {
      if (!story.editors.includes(username)) {
        story.editors.push(username);
        await story.save(); // Ensure changes are saved in DB
        console.log("Updated Editors:", story.editors);
        return "Editor added successfully";
      } else {
        return "User is already an editor";
      }
    } else {
      return "You are not the author of this story";
    }
  } catch (err) {
    console.error(err);
    return "An error occurred";
  }
}

async function removeEditor(storyId, username, author) {
  try {
    const story = await Story.findOne({ storyId });
    if (!story) {
      return "Story not found";
    }

    if (story.author !== author) {
      return "You are not the author of this story";
    }

    // Remove the editor if they exist in the list
    if (story.editors.includes(username)) {
      story.editors = story.editors.filter((editor) => editor !== username);
      await story.save(); // Wait for the save to complete
      return "Editor removed successfully";
    } else {
      return "Editor not found in the list";
    }
  } catch (err) {
    console.error(err);
    return "An error occurred";
  }
}
async function getAllStoriesOfAuthor(author) {
  try {
    const stories = await Story.find({ author: author });
    if (stories) {
      return stories;
    } else {
      throw new Error("Stories not found");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function createFanFiction(storyId, username) {
  await Story.findOne({ storyId })
    .then((story) => {
      if (story) {
        if (User.findOne({username})) {
          const newStory = new Story({
            title: story.title,
            description: story.description,
            content: story.content,
            author: username,
            sourceStory: story.storyId,
            storyId: story.title.replace(/\s+/g, "-").toLowerCase() + Date.now(),
          });
          story.fanfiction.push(newStory.storyId);
          story.save();
          newStory.save();
          addStoryToUser(username, newStory.storyId);
          return "Story forked successfully";
        } else {
          return "User not found";
        }
      } else {
        throw new Error("Story not found");
      }
    })
    .catch((err) => console.log(err));
}

async function getFanFiction(storyId) {
  try {
    const fanFictions = await Story.find({ sourceStory: storyId })
      .then((fanFictions) => {
        if (fanFictions) {
          return fanFictions;
        } else {
          throw new Error("Fan fictions not found");
        }
      })
  } catch (err) {
    console.error("Error fetching fan fictions:", err);
    throw err; // Re-throw to handle it elsewhere
  }
}


function authenticate(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).send('No token provided');
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Invalid or expired token');
  }
}

function formatDate() {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);  // Formats the date to "February 14, 2025"
}

function compareStrings(original, modified) {
  let result = '';
  let i = 0, j = 0;

  while (i < original.length || j < modified.length) {
      if (i < original.length && j < modified.length && original[i] === modified[j]) {
          result += original[i];
          i++;
          j++;
      } else if (j < modified.length && (i >= original.length || original[i] !== modified[j])) {
          result += `<span class='added'>${modified[j]}</span>`;
          j++;
      } else if (i < original.length && (j >= modified.length || original[i] !== modified[j])) {
          result += `<span class='deleted'>${original[i]}</span>`;
          i++;
      }
  }

  return result;
}