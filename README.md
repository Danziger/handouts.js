# handouts.js

A simple Node.js app built on top of Express to handle file uploads from students to tasks or assignments setted by the teachers.

# HOW TO MAKE IT RUN

Just clone the project and run:

    npm install
    npm start
    
In a MongoDB terminal run the following commands to set up test dats (see below).

# TEST DATA FOR MONGODB

Just copy this and paste it in a MongoDB terminal.

## ASSIGNMENTS:

    use handouts;

    db.handouts.insert({
      "subject" : {
      "abbr" : "WST",
      "name" : "Web Systems and Technologies"
      },
      "title" : "First Tasks",
      "d0" : new Date(),
      "df" : new Date(new Date().getTime() + 31536000000),
      "description" : "First Tasks description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    });
    
    db.handouts.insert({
      "subject" : {
      "abbr" : "AIT",
      "name" : "Advanced Internet Technologies"
      },
      "title" : "Second Tasks",
      "d0" : new Date(),
      "df" : new Date(new Date().getTime() + 31536000000),
      "description" : "Second Tasks description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    });
    
    db.handouts.insert({
      "subject" : {
      "abbr" : "WST",
      "name" : "Web Systems and Technologies"
      },
      "title" : "First Oudated Tasks",
      "d0" : new Date(),
      "df" : new Date(new Date() - 31536000000),
      "description" : "First Oudated Tasks description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    });
    
    db.handouts.insert({
      "subject" : {
      "abbr" : "AIT",
      "name" : "Advanced Internet Technologies"
      },
      "title" : "Second Oudated Tasks",
      "d0" : new Date(),
      "df" : new Date(),
      "description" : "Second Oudated Tasks description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    });
    
## SUBJECTS:

    use handouts;

    db.subjects.insert({
      "abbr" : "AIT",
      "name" : "Advanced Internet Technologies"
    });
    
    db.subjects.insert({
      "abbr" : "WST",
      "name" : "Web Systems and Technologies"
    });
