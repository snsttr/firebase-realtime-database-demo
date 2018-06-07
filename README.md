Firebase Realtime Database Demo
===============================

## Setup
1. Setup a firebase realtime database with public read/write permission in your
   [firebase console](https://console.firebase.google.com).
2. Copy the file "/js/firebase-credentials.js.template" to "/js/firebase-credentials.js"
3. Enter your firebase config values:

        var window.firebaseConfig = {
            apiKey: "...",
            authDomain: "...",
            databaseURL: "...",
            projectId: "...",
            storageBucket: "...",
            messagingSenderId: "..."
        };

3. Use a webserver of your choice to run this demo

## Usage
To see realtime database in action try the following steps:
1. Open the demo in a browser of your choice and add/edit/delete messages
2. Open a second window or tab and see that your actions are synchronized across browser windows/tabs.
3. Use a second browser or the incognito mode to see that your actions are still being synchronized.
4. tell a friend to setup this demo with the same firebase credentials. Simultaneously perform actions
   to see that they are still being synchronized.
   
**Warning:** Since you gave public access to your database, everybody can read from and write to it.
If you publish the demo (e.g. heroku or your website), your credentials may be abused.

## Ressources
* https://firebase.google.com/docs/database/web/start
* https://firebase.google.com/docs/reference/js/firebase.database
* https://github.com/firebase/quickstart-js/tree/master/database

## License
See [LICENSE.md](LICENSE.md)