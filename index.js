import fetch from 'node-fetch';
import {Headers} from 'node-fetch';
import fs from 'fs';
import args from 'args';

args.option(['u', 'username'], 'Username of the account to fetch data from');
args.option(['p', 'password'], 'Password of the account to fetch data from; Password is hashed with sha1 and unknown salt');

const flags = args.parse(process.argv);

if(!flags.username || !flags.password) {
  console.log("Please provide username and password");
  console.log("Example: npm run script -- --username=USERNAME --password=PASSWORD")
  process.exit(1);
}

console.log("Username: " + flags.username);

const formdata = new URLSearchParams();
formdata.append("username", flags.username);
formdata.append("password", flags.password);
formdata.append("language", "de");

const requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("https://sso.playa-games.com/json/login?client_id=i43nwwnmfc5tced4jtuk4auuygqghud2yopx&auth_type=access_token", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("Authentication Request: ");
      console.log(result);
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + result.data.token.access_token);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch("https://s2.sfgame.eu/req.php?req=0-00000000000000iY0Ap3B2omAw8Cx-hkM-uVt5DjJgRqZHqWLBMPNmGmXuAzR8Z4O92qAcVmJUG3aeuRhJZaAFKiDcgFMgoq9ZgI8gF9KSZ_vFHXgRo-NG1YrwG3C30HYbzymqg13ILlQfXixwD885vHxhcD0WEZTHwtKtpWSzy6HYfOs-y0okKXntW57zveQponWZYxNpPdZpZxZ0Lj5ZMFrQZnoRijRDRw==&rnd=0,1693903&c=1", requestOptions)
          .then(response => response.text())
          .then(result => {
            console.log(result);
            let userRegex = /&owngroupmember\.r:(.*)&owngrouprank/;
            let dataRegex = /&owngroupsave\.groupSave:(-?\d+\/){63}-?\d+((\/\d*){50})((\/-?\d*){100})((\/\d*){50})((\/\d*){50})((\/-?\d*){76})((\/\d*){50})/;

            let users = userRegex.exec(result)[1];
            let userData = dataRegex.exec(result);
            let lvls = userData[2];
            let treasure = userData[6];
            let instructor = userData[8];
            let guildPet = userData[12];
            let splitUsers = users.split(',');
            let splitLevels = lvls.split('/');
            let splitTreasure = treasure.split('/');
            let splitInstructor = instructor.split('/');
            let splitGuildPet = guildPet.split('/');

            splitLevels.map(lvl => {
              return lvl.length <= 3 ? lvl : lvl.slice(1);
            });

            splitLevels.shift();
            splitTreasure.shift();
            splitInstructor.shift();
            splitGuildPet.shift();

            class User {
              constructor(username, lvl, treasure, instructor, guildPet) {
                this.username = username;
                this.lvl = lvl;
                this.treasure = treasure;
                this.instructor = instructor;
                this.guildPet = guildPet;
              }
            }

            const fullUserData = [];
            splitUsers.forEach((user, index) => {
              let newUser = new User(user, splitLevels[index], splitTreasure[index], splitInstructor[index], splitGuildPet[index]);
              fullUserData.push(newUser);
            })

            console.log("UserData: " + JSON.stringify(fullUserData));
            fs.writeFileSync('out/users.json', JSON.stringify(fullUserData));
          })
          .catch(error => console.log('error', error));
    })
    .catch(error => console.log('error', error));
