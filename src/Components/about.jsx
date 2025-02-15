// import React from 'react'

// const About = () => {
//   return (
//     <div className='mx-auto w-[70%] flex flex-col items-center'>
//         <div>
//       <p className='my-4'>Story Mosaic is a  story-writing platform for creatives around the world. Using Story Mosaic, you can share your stories, work on other people's ideas, and collaborate with writers anywhere. You can create theories and sub-plots about existing stories. You can also create your own stories and get people to write alongside you. Who knows, you may create the next Marvel, or God forbid, DC.</p>

//         <p className=''>Story Mosaic's clean design makes it frictionless for you to write more, and the robust performance of the site makes sure that your updates happen fast, and without hiccups.  </p>

//         <p className='my-4'>Story Mosaic is made for writers who are passionate about the craft. Every piece written on Story Mosaic is licensed with MIT Open Source License, and a community good will badge. Finally, Story Mosaic uses secure encryption to save important data like passwords. We don't collect any personal data from the user, and we are committed to provide an open source tool to motivate writing everywhere.</p>
//     </div>
//     <strong className=''>Made by Notepad Coders from IIT Gandhinagar</strong>
//     </div>
//   )
// }

// export default About

import React from 'react';

const About = () => {
  return (
    <div className="mx-auto w-[70%] flex flex-col items-center min-h-[90vh] justify-between">
      <div>
        <p className="my-4">
          Story Mosaic is a story-writing platform for creatives around the world. Using Story Mosaic, you can share your stories, work on other people's ideas, and collaborate with writers anywhere. You can create theories and sub-plots about existing stories. You can also create your own stories and get people to write alongside you. Who knows, you may create the next Marvel, or God forbid, DC.
        </p>

        <p>
          Story Mosaic's clean design makes it frictionless for you to write more, and the robust performance of the site makes sure that your updates happen fast, and without hiccups.
        </p>

        <p className="my-4">
          Story Mosaic is made for writers who are passionate about the craft. Every piece written on Story Mosaic is licensed with MIT Open Source License, and a community good will badge. Finally, Story Mosaic uses secure encryption to save important data like passwords. We don't collect any personal data from the user, and we are committed to providing an open-source tool to motivate writing everywhere.
        </p>
      </div>

      <strong className="pb-6 text-center">Made by Notepad Coders from IIT Gandhinagar</strong>
    </div>
  );
};

export default About;
