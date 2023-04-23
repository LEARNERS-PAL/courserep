Bentil 💧🌈, [4/23/2023 10:08 PM]
const { Client, LocalAuth, List, RemoteAuth } = require("whatsapp-web.js");
require('dotenv').config()
const mongoose = require('mongoose')
const {
  START,
  MORNING,
  EVENING,
  AFTERNOON,
  REGISTER_ISSUE: COMMAND_ISSUE,
} = require("./responses");
const {
  saveMemberDetails,
  getAllMemberDetails,
  updateMemberDetails,
  getOneMemberDetails,
  githubUserDetails,
  getAllMembersCommits,
  isAdmin,
  sendDictionaryRequest,
  getWeatherData,
  getLatLong,
  getFormatedDate,
  fetchJokes,
} = require("./services/functions");
const {
  getFlagValues,
  genrateMemberSummary,
  getGithubUsername,
  summarizeGithubProfile,
  generateLeaderboard,
  generateWelcome,
  generatePollMessage,
  generatePollResultsMessage,
} = require("./services/utils");
const cron = require("node-cron");
const qrcode = require("qrcode-terminal");
let express = require("express");
const moment = require("moment");
const { initModels } = require("./models/__init");
const { default: axios } = require("axios");
const { MongoStore } = require("wwebjs-mongo");
const Session = require("./context").default;



let isDevMode = false;
let qr_code = null;
let botIsBusiness = false

const HEADERS = { "Content-Type": "application/json" };

let _Session = new Session()

process.argv.forEach(function (val) {
  var arg = val.split("--");
  if (arg.length > 0) {
    if (arg[1] === "dev") {
      process.env["MONGO_CONNECTION"] = process.env.MONGO_URI_DEV;
    } else {
      process.env["MONGO_CONNECTION"] = process.env.MONGO_URI_PROD;
    }
  }
});

// setInterval(async () => {
//   axios.get("https://git-friend-bot.herokuapp.com/");
//   console.log("=========")
//   console.log("")
//   console.log("")
//   console.log("")
//   const used = process.memoryUsage();
//   for (let key in used) {
//     console.log(${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB);
//   }
//   console.log("")
//   console.log("")
//   console.log("=========")
// }, 4000);


process.argv.forEach((processArgs) => {
  // get the flags of the run time
  let args = processArgs.split("--");

  if (args.length > 0) {
    if (args[1] === "dev") {
      isDevMode = true;
      return;
    } else {
      isDevMode = false;
      return;
    }
  }
});

// DO NOT TOUCH THIS KEEPS THE BOT UP :)
setInterval(async () => {
  axios.get("https://git-friend-bot.herokuapp.com/");
}, 180000);


if (isDevMode) {
  console.log("<< Running in DEV mode 🎮 >>");
} else {
  console.log("<< Running in PROD mode 🛫 >>");
}

const doSome = async () => {
  // run tests here without the client
};

// doSome();

Bentil 💧🌈, [4/23/2023 10:08 PM]
const mongo = process.env["MONGO_CONNECTION"]  "";

(async function () {

  await mongoose.connect(mongo)

  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    puppeteer: {
      headless: isDevMode ? false : true,
      args: isDevMode ? ['--disable-extensions'] : [
        "--no-sandbox",
        '--disable-extensions',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
      ],
      ignoreDefaultArgs: ['--disable-extensions'],
    },
    //  authStrategy: new RemoteAuth({
    //   store: store,
    //   backupSyncIntervalMs: 300000
    // }),
    authStrategy: new LocalAuth()
  });



  const connection = mongoose.connection;


  client.on("qr", (qr) => {
    // Generate and scan this code with your phone
    qr_code = qr;
    console.log("QR RECEIVED", qr);
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", async () => {
    console.log("Client is ready!");
    console.log(await client.getWWebVersion());
    qr_code = "Done";


    console.log("======")
    console.log("Client info", client?.info?.platform)
    console.log("======")
    console.log("======")


    const allChats = await client.getChats();
    const chat = allChats.find((chat) => {
      return chat.name.toLocaleLowerCase().includes(isDevMode ? "testing" : 'github');
    });


    const startMessage = await chat.sendMessage("I am back online ✅")
    const botContact = await startMessage.getContact()
    botIsBusiness = botContact.isBusiness


    _Session.getSessions().then((groups) => {

      groups.forEach(async (session) => {
        if (session?.polls) {
          const polls = [...session.polls]

          // const activePolls = polls.filter((poll) => new Date(poll.get('endsAt')) > new Date())
          // const inActivePolls = polls.filter((poll) => new Date(poll.get('endsAt')) < new Date())


          // client.getChatById(session?.id).then((chat) => {
          //   console.log("session?.id", session?.id)

          //   // console.log("Active Polls", activePolls.length)
          //   // activePolls.forEach(async (poll) => {
          //   //   console.log("session?.id poll", poll)
          //   //   const timeoutIn = Math.abs(new Date().valueOf() - new Date(poll.endsAt).valueOf())

          //   //   console.log("Activating", poll?.get('id')?.id, "timer", timeoutIn)
          //   //   setTimeout(async () => {
          //   //     const pollId = poll?.get('id')?.id
          //   //     const sessionId = session?.id

          //   //     // get active session 
          //   //     const activeSession = _Session.getSession(sessionId)

          //   //     // get poll from that session
          //   //     const foundPoll = activeSession?.polls?.find(poll => poll?.get('id')?.id === pollId)
          //   //     console.log("foundPoll", foundPoll?.get('id')?.id)


          //   //     const results = generatePollResultsMessage(foundPoll?.get('question'), foundPoll?.get('options'), foundPoll?.get('answers'), activeSession?.groupMentions)
          //   //     chat.sendMessage(results, { mentions: [...activeSession?.groupMentions] })

          //   //     let currentPolls = activeSession.polls
          //   //     const newSessionData = { ...activeSession, polls: currentPolls.filter((poll) => poll?.get('id')?.id !== pollId) }
          //   //     _Session.setSession(sessionId, newSessionData)
          //   //   }, timeoutIn);
          //   // })

          //   // console.log("inActive Polls", inActivePolls.length)
          //   // inActivePolls.forEach(async (poll) => {
          //   //   _Session.getSession(session?.id).then((activeSession) => {
          //   //     const pollId = poll?.get('id')?.id
          //   //     const sessionId = session?.id

          //   //     const results = generatePollResultsMessage(poll?.get('question'), poll?.get('options'), poll?.get('answers'), activeSession?.groupMentions)
          //   //     chat.sendMessage(results, { mentions: [...activeSession?.groupMentions] })

          //   //

Bentil 💧🌈, [4/23/2023 10:09 PM]
let currentPolls = activeSession.polls
          //   //     const newSessionData = { ...activeSession, polls: currentPolls.filter((poll) => poll?.id?.id !== pollId) }
          //   //     _Session.setSession(sessionId, newSessionData)
          //   //   })
          //   // })
          // })
        }
      });
    })


    const timezone = {
      scheduled: true,
      timezone: "Africa/Accra",
    };

    cron.schedule(
      "0 6 * * *",
      async () => {
        // run at 6 am in the morning
        const weatherData = await getWeatherData("5.5571096", "-0.2012376")
        let temp = weatherData.data.main.temp
        let weatherDescription = weatherData.data.weather[0].description
        let newMorning = `${MORNING} \n By the way, It is ${temp} degrees celcius (${weatherDescription} ⛅️) in Accra this morning.`
        chat.sendMessage(newMorning);
      },
      timezone
    );

    cron.schedule(
      "0 12 * * *",
      async () => {
        // run at 12 pm in the afternoon
        const weatherData = await getWeatherData("5.5571096", "-0.2012376")
        let temp = weatherData.data.main.temp
        let weatherDescription = weatherData.data.weather[0].description
        let newAfternoon = `${AFTERNOON} \n And be aware, the weather ⛅️ this Noon is ${temp} degrees celcius (${weatherDescription}) here in Accra`
        chat.sendMessage(newAfternoon);
      },
      timezone
    );

    cron.schedule(
      "0 18 * * *",
      async () => {
        // run at 6 pm in the evening
        const weatherData = await getWeatherData("5.5571096", "-0.2012376")
        let temp = weatherData.data.main.temp
        let weatherDescription = weatherData.data.weather[0].description
        let newEvening = `${EVENING} \n Well there is something I know about the weather ⛅️ in Accra this evening. It's ${temp} degrees celcius (${weatherDescription}). \n \n Happy Hacking!!`
        chat.sendMessage(newEvening);
      },
      timezone
    );

    //Per hour automation
    cron.schedule(
      "0 */1 * * *",
      async () => {
        const allMembers = await getAllMemberDetails();
        let response = await getAllMembersCommits(allMembers);
        Promise.all(response).then((data) => {
          let generatedLeaderboard = generateLeaderboard(
            data
              .filter((member) => member?.hasPushed && member?.name)
              .sort((a, b) => b.numberOfContributions - a.numberOfContributions)
          )
          chat.sendMessage(generatedLeaderboard)
        })

      },
      timezone
    );

    // run at 11:59pm everyday
    cron.schedule(
      "59 23 * * *",
      async () => {
        const allMembers = await getAllMemberDetails();
        let response = await getAllMembersCommits(allMembers);
        Promise.all(response).then((data) => {
          let generatedLeaderboard = generateLeaderboard(
            data
              .filter((member) => member?.hasPushed && member?.name)
              .sort((a, b) => b.numberOfContributions - a.numberOfContributions)
          )
          chat.sendMessage(generatedLeaderboard)
        })

      },
      timezone
    );


  });

  client.on("message", async (msg) => {
    console.log("===Recieved Message ===")
    const chatSession = await msg.getChat();
    const sessionId = chatSession?.id._serialized.toString()
    let currentSession;

    currentSession = await _Session.getSession(sessionId, client)

    if (!currentSession) {
      // doesnt exist create new session
      const sessionObject = {
        id: sessionId,
        name: "Team Bot",
        groupMentions: [],
        isMuted: false,
        polls: []
      };

      _Session.setSession(sessionId, sessionObject);
      currentSession = sessionObject
      console.log("<<<<<<<<<Session Saved>>>>>>>>")
    }

Bentil 💧🌈, [4/23/2023 10:09 PM]
try {
      // listen to all quoted messages that have the 
      // if (msg.hasQuotedMsg && currentSession.polls) {
      //   const senderContact = await msg.getContact();
      //   const quotedMessage = await msg.getQuotedMessage()
      //   // check if its an active poll
      //   function findPoll(polls = [], quotedMessage) {
      //     return polls.findIndex((poll) => {
      //       return poll.get('id')?.id === quotedMessage.id.id ? true : false
      //     })
      //   }

      //   const foundPollIndex = findPoll(currentSession.polls, quotedMessage)
      //   // if we found a poll
      //   if (foundPollIndex > -1) {
      //     // get that particular poll
      //     const currentPoll = currentSession?.polls[foundPollIndex]

      //     if (currentPoll?.voters?.get(senderContact.id.user)) {
      //       msg.reply("You have already voted 👀")
      //       return
      //     }

      //     // check if msg body of the message includes only a number
      //     const reg = new RegExp('^[0-9]+$');
      //     if (reg.test(msg.body)) {
      //       const optionIndex = parseInt(msg.body)

      //       if (optionIndex <= currentPoll.get('options').length) {
      //         // increase answer count
      //         const answerCount = parseInt(currentPoll.get('answers')[optionIndex - 1]) + 1
      //         currentPoll.get('answers')[optionIndex - 1] = answerCount

      //         // add the voter
      //         currentPoll.get('voters').push(senderContact.id.user)

      //         // add update the poll
      //         currentSession.polls[foundPollIndex] = currentPoll

      //         const newSessionData = { ...currentSession }
      //         _Session.setSession(sessionId, newSessionData)

      //         msg.reply("✅ You have voted")
      //       } else {
      //         msg.reply("Wrong Entry, Reply the poll with a number that is available")
      //       }

      //     }

      //   }else{
      //     console.log("Poll was not found")
      //   }

      // }

      console.log("currentSession", currentSession)

      if (msg.body == "!hello" && currentSession.isMuted === false) {
        console.log()
        msg.reply(currentSession?.name ? `Hi, my name is ${currentSession?.name}. \n Guess you need my help🥰 Use *_!help_* to find my commands. ` : `Hello, sup?`);
      }

      if (msg.body == "!ping" && currentSession.isMuted === false) {
        msg.reply("pong 🏓");
      }

      if (msg.body.startsWith("!poll") && currentSession.isMuted === false) {
        const currentChat = await msg.getChat();
        const senderContact = await msg.getContact();

        if (!currentSession?.polls) {
          currentSession.polls = []
        }

        if (currentChat.isGroup) {
          if (isAdmin(currentChat.participants, senderContact)) {
            const { question, duration, options } = getFlagValues(msg.body);

            if (!question  !duration  !options) {
              msg.reply("Please ensure that 'question' , 'duration' & 'options' are set ")
              return;
            }

            const endsAt = moment(new Date()).add(parseInt(duration), 'm').toDate().toISOString();
            const optionArray = options.split(",").map(value => value.trim())

            const pollMsg = generatePollMessage(question, endsAt, optionArray, currentSession?.groupMentions)

            // let sections = [
            //   {
            //     title: 'sectionTitle', 
            //     rows: [
            //       { title: 'ListItem1', description: 'desc' }, 
            //       { title: 'ListItem2', description: 'desc2' },
            //       { title: 'ListItem2', description: 'desc3' },
            //       { title: 'ListItem3', description: 'desc4' }
            //     ]
            //   }];

            // let list = new List("title", 'btnText', sections, 'Title', 'footer');

            const pollMessage = await msg.reply(pollMsg, null, {
              mentions: [...currentSession?.groupMentions]
            })

Bentil 💧🌈, [4/23/2023 10:09 PM]
const poll = {
              id: pollMessage.id,
              question,
              endsAt,
              options: optionArray,
              answers: optionArray.map(() => 0),
              voters: []
            }
            console.log("Created poll", poll)

            let currentPolls = currentSession.polls
            currentPolls.push(poll)
            const newSessionData = { ...currentSession, polls: currentPolls }
            console.log(newSessionData, "newSessionData")
            _Session.setSession(sessionId, newSessionData)


            const timeoutIn = Math.abs(new Date().valueOf() - new Date(poll.endsAt).valueOf())
            console.log("Activating", poll?.id?.id, "timer", timeoutIn)

            setTimeout(async () => {
              const pollId = poll?.id?.id
              const sessionId = currentSession?.id

              // get active session 
              const activeSession = currentSession

              // get poll from that session
              const foundPoll = activeSession?.polls?.find(poll => poll?.id?.id === pollId)
              console.log("")
              console.log("")
              console.log("")
              console.log("")
              console.log("")
              console.log("=========")
              console.log("=========")
              console.log("=========")
              console.log("foundPoll", foundPoll)


              const results = generatePollResultsMessage(foundPoll?.question, foundPoll?.options, foundPoll?.answers, activeSession?.groupMentions)
              const chat = await msg.getChat()
              chat.sendMessage(results, {
                mentions: [...activeSession?.groupMentions]
              })
              pollMessage.delete(true)

              let currentPolls = activeSession.polls
              const newSessionData = { ...activeSession, polls: currentPolls.filter((poll) => poll?.id?.id !== pollId) }
              _Session.setSession(sessionId, newSessionData)
            }, timeoutIn);

          } else {
            msg.reply("Please only Admins can do this 👀");
          }
        } else {
          msg.reply("Polls can happen in groups 👀");
        }
      }

      if (msg.body == "!help" && currentSession.isMuted === false) {

Bentil 💧🌈, [4/23/2023 10:09 PM]
// let sections = [
        //   {
        //     title: 'sectionTitle', rows: [
        //       { title: "*!ping*", description: 'use this to check if I am awake 🌝' },
        //       { title: "*!help*", description: 'if you need help, i dey 😃' },
        //       { title: "*!members*", description: 'shows a list of all members 👨‍👩‍👧‍👦' },
        //       { title: "*!github*", description: 'shows your registered github profile 🚀' },
        //       { title: "*!leaderboard*", description: 'shows the group\'s github leaderboard 📊' },
        //       { title: "*!register*", description: 'register yourself ➕' },
        //       { title: "*!update*", description: 'update your registered details ⬆️' },
        //       { title: "*!define*", description: 'to find the meaning of word from dictionary 📚' },
        //       { title: "*!poll*", description: 'create a poll 🗳' },
        //     ]
        //   }];

        // let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];


        // const list = new List(START, "Commands", sections, "Help Commands")

        msg.reply(START)

        // if (botIsBusiness) {
        //   msg.reply(START)
        // } else {
        //   msg.reply(list);
        // }

      }

      if (msg.body == "!mute" && !currentSession.isMuted) {
        const currentChat = await msg.getChat();
        const senderContact = await msg.getContact();

        if (currentChat.isGroup) {
          if (isAdmin(currentChat.participants, senderContact)) {
            let newSessionData = { ...currentSession, isMuted: true }
            _Session.setSession(sessionId, newSessionData)
            msg.reply("I will be quiet from now 🤐, use *!unmute* to disable this");
          } else {
            msg.reply("Please only Admins can do this 👀");
          }
        } else {
          if (!currentSession.isMuted) {
            let newSessionData = { ...currentSession, isMuted: true }
            _Session.setSession(sessionId, newSessionData)
            msg.reply("I will be quiet from now 🤐, use *!unmute* to disable this");
          }
        }
      }

      if (msg.body == "!unmute" && currentSession.isMuted) {
        const currentChat = await msg.getChat();
        const senderContact = await msg.getContact();

        if (currentChat.isGroup) {
          if (isAdmin(currentChat.participants, senderContact)) {
            let newSessionData = { ...currentSession, isMuted: false }
            _Session.setSession(sessionId, newSessionData)
            msg.reply("Yes please 😃, if you need something I am ready to *!help*");
          }
        } else {
          if (!currentSession.isMuted) {
            let newSessionData = { ...currentSession, isMuted: false }
            _Session.setSession(sessionId, newSessionData)
            msg.reply("Yes please 😃, if you need something I am ready to *!help*");
          }
        }
      }

      if (msg.body.startsWith("!leaderboard") && currentSession.isMuted === false) {
        const currentChat = await msg.getChat();
        const senderContact = await msg.getContact();

        // Check if is admin
        if (isAdmin(currentChat.participants, senderContact)) {
          let leaderboardData = getFlagValues(msg.body);
          let numberOfDays = leaderboardData?.days  0;
          if (numberOfDays >= 0 && numberOfDays < 373) {
            const allMembers = await getAllMemberDetails();
            let response = await getAllMembersCommits(allMembers, numberOfDays);


            // calculate Range
            let range = numberOfDays == 0 ? For Today, ${getFormatedDate(numberOfDays)} : FROM ${getFormatedDate(numberOfDays, 's')} TO ${getFormatedDate(numberOfDays, 'e')} ;

            Promise.all(response).then((data) => {
              msg.reply(
                generateLeaderboard(
                  data
                    .filter((member) => member?.hasPushed && member?.name)
                    .sort((a, b) => b.numberOfContributions - a.numberOfContributions), range
                )

Bentil 💧🌈, [4/23/2023 10:09 PM]
);

            });
          } else {
            msg.reply("Hey dude👀, What are you tryna do here? People like you always makes life difficult for developers😓😪. Tueh!");
          }
        } else {
          msg.reply("Sorry, this function is now only available to admins 😅, you will have to wait for every hour to see the leaderboard, \n \nMake sure you are pushing code tho,");
        }
      }

      // This will show all the get leaderboard commands list
      if (msg.body == "!show-leaderboardsse" && !currentSession.isMuted) {

        // Create a list
        let sections = [
          {
            title: 'Leaderboard Commands', rows: [
              { title: "!leaderboard days=0", description: 'shows github leaderboard for today📊' },
              { title: "!leaderboard days=1", description: 'shows github leaderboard from yesterday📊' },
              { title: "!leaderboard days=7", description: 'shows github leaderboard from last week to today📊' },
              { title: "!leaderboard days=30", description: 'shows github leaderboard from last month to today📊' },
              { title: "!leaderboard days=365", description: 'shows github leaderboard from last year to today📊' }

            ]
          }
        ]


        if (botIsBusiness) {
          msg.reply("This feature cannot be used on business accounts")
        } else {
          const list = new List("Leaderboard Generator", "Commands", sections, "Leaderboard Commands")
          msg.reply(list);
        }


      }


      if (msg.body == "!github" && currentSession.isMuted === false) {
        console.log("Getting github");
        const senderContact = await msg.getContact();
        const user = await getOneMemberDetails(senderContact?.id?.user);
        if (!user) {
          msg.reply(
            👀 You have not registered, use *'!register'* command to add up ${process.env["REGISTER_URL"] ? `or go to ${process.env["REGISTER_URL"]} to generate registration string : ''}`
          );
        } else {
          console.log("user", user);
          if (user?.githuburl) {
            const username = getGithubUsername(user?.githuburl);
            const githubUser = await githubUserDetails(username);
            msg.reply(
              githubUser
                ? summarizeGithubProfile(githubUser)
                : I cant find your username ('${username}') on github
            );
          }
        }
      }

      if (msg.body.startsWith("!keep-mentions") && currentSession.isMuted === false) {
        const currentChat = await msg.getChat();
        const senderContact = await msg.getContact();
        if (currentChat.isGroup) {
          if (isAdmin(currentChat.participants, senderContact)) {
            const mentionContacts = await msg.getMentions();
            // console.log("mentionContacts", mentionContacts.length);
            // console.log("groupMentions", groupMentions.length);

            // filter already existing contacts
            const newMentionedContact = mentionContacts.filter((value) => {
              return currentSession.groupMentions.findIndex(
                (contact) => value.number === contact.number
              ) !== -1
                ? false
                : true;
            });

            if (newMentionedContact.length === 0) {
              msg.reply(
                "These users already exist, use !everyone command to @ your stored mentioned"
              );
            }

            // console.log("newMentionedContacts", newMentionedContact.length);

            let groupMentions = [...currentSession.groupMentions, ...newMentionedContact];
            let newSessionData = { ...currentSession, groupMentions: groupMentions }
            _Session.setSession(sessionId, newSessionData)


            msg.reply(
              "Mentions Stored ✅, use !everyone command to @ your stored mentioned"
            );
          } else {
            msg.reply("Please only Admins can do this 👀");
          }
        }
      }

Bentil 💧🌈, [4/23/2023 10:09 PM]
if (msg.body.startsWith("!everyone") && currentSession.isMuted === false) {
        const currentChat = await msg.getChat();
        const senderContact = await msg.getContact();

        // console.log("chat id", currentChat?.id?.)

        if (currentChat.isGroup) {
          // check if is admin
          if (isAdmin(currentChat.participants, senderContact)) {
            let response = "Please note everyone \n";
            console.log("groupMentions", currentSession?.groupMentions);
            if (currentSession?.groupMentions.length > 0) {
              for (const participant of currentSession.groupMentions) {
                console.log(Adding @${participant.number});
                response += @${participant.number} \n;
              }
              msg.reply(response, null, {
                mentions: [...currentSession.groupMentions],
              });
            } else {
              msg.reply(
                "There are no stored mentions, use *!keep-mentions* followed by all the mentions"
              );
            }
          } else {
            msg.reply("Please only Admins can do this 👀");
          }
        } else {
          msg.reply("You are the only person here 👀");
        }
      }

      if (msg.body == "!members" && currentSession.isMuted === false) {
        const senderContact = await msg.getContact();
        const user = await getOneMemberDetails(senderContact?.id?.user);
        if (!user) {
          msg.reply(
            "👀 You have not registered and you want to see other people, 😒 go and '!register'"
          );
        } else {
          const members = await getAllMemberDetails();
          const response = genrateMemberSummary(members);
          msg.reply(response);
        }
      }

      if (msg.body.startsWith("!update") && currentSession.isMuted === false) {
        const allowedKeys = ["name", "githuburl"]
        // get the key-values object from sender
        let updateData = getFlagValues(msg.body);
        console.log("Update data", updateData);
        let canUpdate = true

        for (var [key] of Object.entries(updateData)) {
          if (!allowedKeys.includes(key)) {
            canUpdate = false;
            msg.reply("${key}" cannot be updated remove it from command);
            break;
          }
        }

        if (!canUpdate) {
          return;
        }

        // get with the contact id
        const senderContact = await msg.getContact();
        console.log("Sender Contact", senderContact?.id?.user);

        // store the data
        const response = await updateMemberDetails(
          senderContact?.id?.user,
          updateData
        );

        msg.reply(response);
      }

      if (msg.body.startsWith("!set-bot") && currentSession.isMuted === false) {
        const currentChat = await msg.getChat();
        const senderContact = await msg.getContact();

        // get the key-values object from sender
        const updateData = getFlagValues(msg.body);

        if (currentChat.isGroup) {
          // check if is admin
          if (isAdmin(currentChat.participants, senderContact)) {
            try {
              // update bot stuff
              // TODO: Run some validataion here
              let newSessionData = { ...currentSession, ...updateData }
              _Session.setSession(sessionId, newSessionData)
              msg.reply("Bot details updated ✅");
            } catch (error) {
              msg.reply("Bot update Failed ❌, try again");
            }
          } else {
            msg.reply("Please only Admins can do this 👀");
          }
        }
      }

      if (msg.body.startsWith("!register") && currentSession.isMuted === false) {
        const allowedKeys = ["name", "githuburl"]

        // get the key-values object from sender
        const registrationData = getFlagValues(msg.body);
        console.log("Registration data", !!registrationData);
        let canRegister = true

Bentil 💧🌈, [4/23/2023 10:09 PM]
for (var [key] of Object.entries(registrationData)) {
          if (!allowedKeys.includes(key)) {
            canRegister = false;
            msg.reply("${key}" cannot be registered remove it from command);
            break;
          }
        }


        if (!canRegister) {
          return;
        }


        if (registrationData?.name && registrationData?.githuburl) {
          console.log("Registration data", registrationData);

          // get with the contact id
          const senderContact = await msg.getContact();
          console.log("Sender Contact", senderContact?.id?.user);

          // store the data
          const response = await saveMemberDetails(
            senderContact?.id?.user,
            { ...registrationData, number: senderContact?.id?.user }
          );

          msg.reply(response);
        } else {
          msg.reply(COMMAND_ISSUE);
        }
      }

      // dictionary call
      if (msg.body.startsWith("!define") && currentSession.isMuted === false) {
        const currentChat = await msg.getChat();

        const dictData = getFlagValues(msg.body);
        let response = Here is the definition(s): of *_"${dictData.word}"_* I found👀👇🏿 \n \n;

        if (dictData.word.length > 0) {
          sendDictionaryRequest(dictData.word).then(function (res) {
            let defs = res?.data[0]?.defs
            if (defs) {
              console.log(defs)
              response += ${defs?.map((value, idx) => `${idx + 1}. ${value} \n).join("")}`; //split definitions to various points
              msg.reply(response); //Reply Chat with definition meaning
            } else {
              msg.reply( *_"${dictData.word}"_* cannot be found try again);
            }

          });
        } else {
          msg.reply(
            "There is now word to define. \nCommand must match ➡️ *!define*  word='WORD_TO_SEARCH'"
          );
        }
      }

      // get Weather
      if (msg.body.startsWith("!weather") && currentSession.isMuted === false) {
        const weatherQuery = getFlagValues(msg.body)
        // console.log(weatherQuery)
        let defaultResponse = The weather ⛅️ today in "${weatherQuery.location}", is \n

        if (weatherQuery.location.length > 0) {
          const coordinates = await getLatLong(weatherQuery.location)
          console.log(coordinates);

          if (coordinates.data.length > 0) {
            const weatherData = await getWeatherData(coordinates.data[0].lat, coordinates.data[0].lon)
            let weatherDescription = weatherData.data.weather[0].description
            let temp = weatherData.data.main.temp

            const message = ${defaultResponse} "${temp} degrees celcius (${weatherDescription})"
            //  console.log(message);
            msg.reply(message);
          } else {
            msg.reply("Location does not exist")
          }

        } else {
          msg.reply("Please enter a valid location")
        }
      }

      // Get jokes
      if (msg.body == "!joke" && currentSession.isMuted === false) {
        const jokeData = await fetchJokes();
        msg.reply(jokeData.data.joke);
      }

    } catch (err) {
      // catch all errors down here
      console.log("Error in Session:", err, sessionId, "object:", currentSession)
    }


  });

  client.on("authenticated", () => {
    console.log("AUTHENTICATED");
  });

  client.on("group_join", async (notification) => {
    console.log("SOMEONEs JOINED", notification);
    try {

      const sessionId = notification.id.remote
      let currentSession;

      currentSession = await _Session.getSession(sessionId, client)

      if (!currentSession) {
        // doesnt exist create new session
        const sessionObject = {
          name: "Team Bot",
          groupMentions: [],
          isMuted: false,
        };

        _Session.setSession(sessionId, sessionObject);
        currentSession = sessionObject
        console.log("<<<<<<<<<Session Saved>>>>>>>>")
      }

      currentSession = await _Session.getSession(sessionId, client)

Bentil 💧🌈, [4/23/2023 10:09 PM]
const reciepients = await notification.getRecipients();

      const chat = await client.getChatById(sessionId)

      const welcome = generateWelcome(reciepients, currentSession.name);
      console.log(reciepients[0].number);
      console.log(chat);

      await chat.sendMessage(welcome, {
        mentions: [...reciepients],
      });
    } catch (error) {
      console.log("Something went wrong", error);
    }
  });

  client.on("auth_failure", (msg) => {
    // Fired if session restore was unsuccessful
    console.error("AUTHENTICATION FAILURE", msg);
  });




  connection.once("open", async () => {
    console.log(">> Mongo database connection established successfully <<");
    await initModels();
  });
  connection.on("error", () => {
    console.error.bind(console, ">> connection error <<");
  });

  client.initialize();


  const PORT = process.env.PORT || 8081;

  let app = express();

  app.use(express.static("build"));

  app.get("/qr", (req, res) => {
    console.log(__dirname + "/build");
    res.writeHead("200", HEADERS);
    if (qr_code) {
      const respData = { msg: waiting, code: qr_code };
      res.end(JSON.stringify(respData));
    } else {
      const respData = { msg: done, code: qr_code };
      res.end(JSON.stringify(respData));
    }
  });

  app.listen(PORT).on("listening", () => {
    console.log(Listening on port ${PORT} 🚀 ....);
  });



})();