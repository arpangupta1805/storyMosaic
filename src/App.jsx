import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './Components/Dashboard/Dashboard';
import Navbar from './Components/Landing Page/Navbaar';
import StoryReader from './Components/Landing Page/card';
import StoryCard from './Components/Landing Page/PopularStories';
import AuthPage from './Components/signin_up/LoginPage';
import Edit from './Components/story/Edit';
import Fanfiction from './Components/story/fanfiction';
import InfoSection from './Components/story/info';
import Editor_Admin from './Components/story/read';
import Request from './Components/story/request';
import LandingPage from "./Components/Landing Page/Landingpage";
import Errorpage from "./Components/Errorpage";
import CreateStory from "./Components/Dashboard/createstory";
import Compare from "./Components/story/compare";



function App() {

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/authentication" element={<AuthPage />} />
        <Route path="/popular" element={<StoryCard />} />
        <Route path="/user/:username" element={<Dashboard />} />
        <Route path="/:storyid/read" element={<StoryReader />} />
        <Route path="/story/:storyid" element={<Editor_Admin />} />
        <Route path="/story/:storyid/read" element={<Editor_Admin />} />
        <Route path="/story/:storyid/edit" element={<Edit />} />
        <Route path="/compare/:pullRequestId" element={<Compare />} />
        <Route path="/story/:storyid/request" element={<Request />} />
        <Route path="/story/:storyid/fanfictions" element={<Fanfiction />} />
        <Route path="/story/:storyid/info" element={<InfoSection />} />
        <Route path="/create" element={<CreateStory />} />
        <Route path="*" element={<Errorpage />} />
      </Routes>
    </Router>
    </>
  )
}
export default App