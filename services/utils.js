const moment = require("moment");

exports.getFlagValues = function (queryCommand = "") {
  let FlagValuesObject = {};
  const stringParts = queryCommand
    .split(" ")
    .map((part) => part.replace(/["']/g, ""));

  let valueCompleted = true;
  let accummulator_key = "";
  let accummulator_value = [];

  const splitParts = stringParts.map((part) => part.split("=")).filter(part => part[0] !== "");
  // console.log("splitParts", splitParts);
  // return
  for (let i = 0; i < splitParts.length; i++) {
    // console.log(splitParts.length, i, "->")
    if (i === 0) {
      //  dont do anything
    } else {

      if (splitParts.length - 1 === i) {
        // we have reached the end  
        if (valueCompleted === false) {
          accummulator_value.push(splitParts[i][0])
          // console.log(accummulator_value)
          FlagValuesObject[accummulator_key] = accummulator_value.join(" ")
          // console.log("END")
        }
      } else {
        // we have not reached

        // we get to the current item less than 2
        if (splitParts[i].length < 2) {
          valueCompleted = false
          // check the value before this
          if (splitParts[i - 1].length > 1) {
            accummulator_key = splitParts[i - 1][0]

            accummulator_value.push(splitParts[i - 1][1])
            accummulator_value.push(splitParts[i][0])
            // console.log("acc-value", splitParts[i][0])
          } else {
            accummulator_value.push(splitParts[i][0])
            // console.log("acc-value", splitParts[i][0])
          }
        }

      }

      if (splitParts[i].length > 1) {
        // console.log("Value Completed",valueCompleted )

        if (valueCompleted === true) {
          // console.log("key-1", splitParts[i][0], "value", splitParts[i][1])
          FlagValuesObject[splitParts[i][0]] = splitParts[i][1]
        } else {

          if (splitParts.length - 1 === i) {
            // we are done accumulating
            valueCompleted = true
            // console.log("key-2", accummulator_key, "value", accummulator_value)
            FlagValuesObject[accummulator_key] = accummulator_value.filter((_, idx) => accummulator_value.length - 1 !== idx).join(" ")
            accummulator_value = accummulator_value.filter(() => false)
            accummulator_key = ""

            // console.log("key-1", splitParts[i][0], "value", splitParts[i][1])
            FlagValuesObject[splitParts[i][0]] = splitParts[i][1]


          } else {
            // we are done accumulating
            valueCompleted = true
            // console.log("key-2", accummulator_key, "value", accummulator_value)
            FlagValuesObject[accummulator_key] = accummulator_value.join(" ")

            // reset
            accummulator_value = accummulator_value.filter(() => false)
            accummulator_key = ""

            // console.log("key-1", splitParts[i][0], "value", splitParts[i][1])
            FlagValuesObject[splitParts[i][0]] = splitParts[i][1]
          }


        }
      } else {
        if (splitParts.length > i && valueCompleted === true) {
          // console.log("END", splitParts[i-1][0])

          // get the last but one item
          let keyBefore = splitParts[i - 1][0]
          let valueBefore = splitParts[i - 1][1]

          // console.log("keyBefore",keyBefore)
          // console.log("valueBefore",valueBefore)

          // add the last but one item
          FlagValuesObject[keyBefore] = valueBefore.split(" ") + " " + splitParts[i][0]
        }
      }

    }
  }

  return FlagValuesObject;
};

exports.getGithubUsername = function (githuburl = "") {
  const urlParts = githuburl.split("/");
  return urlParts[urlParts.length - 1];
};

exports.isToday = function (someDate) {
  const today = new Date();
  const date = new Date(someDate);
  return (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  );
};

exports.genrateMemberSummary = function (members = []) {
  members = members.filter((member) => member.name !== undefined);
  return (summary = `
*THESE ARE OUR GITHUBS*
*DO NOT BE LEFT OUT OF THE TEAM'S PROGRESS*

${members
      .map((member) => {
        return ${member.name} - ${member.githuburl} \n;
        // return ${member.name || "No name"} - ${member.githuburl || "No github url"} \n;
      })
      .join("")}

*YOUR NAME IS NOT HERE?*
- Use the *!register* command
- eg: !register name=Sally githuburl=https://github.com/LighteningCode
- make sure to set "name=" and "githuburl=" if you want to see the name on the list
`);
};

exports.summarizeGithubProfile = function (user) {
  return (summary = `Your github profile 
__________________________  
*Name 👤:* ${user?.name}
*Status 👀:* ${user?.status?.message  'None'} 
*Followers 👥:* ${user?.followers?.totalCount  'None'}
*Following 👩🏾‍🤝‍👨🏽:* ${user?.following?.totalCount  'None'}  
*Bio 📝:* ${user?.bio  'None'}
*Website 🌐:* ${user?.websiteUrl || 'None'}
`)
}

function getEmojiPosition(index) {
  const values = [
    '\u0030\uFE0F\u20E3 ',
    '\u0031\uFE0F\u20E3  ',
    '\u0032\uFE0F\u20E3 ',
    '\u0033\uFE0F\u20E3  ',
    '\u0034\uFE0F\u20E3  ',
    '\u0035\uFE0F\u20E3 ',
    '\u0036\uFE0F\u20E3  ',
    '\u0037\uFE0F\u20E3 ',
    '\u0038\uFE0F\u20E3 ',
    '\u0039\uFE0F\u20E3 ',
    '\u{1F51F}',

  ]

  if (index > values.length) {
    return index
  } else {
    return values[index]
  }
}

exports.getEmojiPosition = getEmojiPosition;

exports.generateLeaderboard = function (members = [], range) {

  return (summary = `Leaderboard (Contributions)🏆 ${range}
_______________________________

${members
  .map((member, index) => {
    if (index === 0) {
      return 🥇 ${member?.name} - *${member?.numberOfContributions}* \n(${member?.githuburl})  \n \n
    } else if (index === 1) {
      return 🥈 ${member?.name} - *${member?.numberOfContributions}* \n(${member?.githuburl})  \n \n
    } else if (index === 2) {
      return 🥉 ${member?.name} - *${member?.numberOfContributions}* \n(${member?.githuburl})  \n \n
    }
    return `${
      index === 9
        ? getEmojiPosition(index + 1)
        : (index + 1)
            .toString()
            .split('')
            .map((value) => getEmojiPosition(value))
            .join('')
            .replace(' ', '')
    } ${member?.name} - *${member?.numberOfContributions}* \n(${
      member?.githuburl
    })  \n \n`
  })
  .join('')}

*YOUR NAME IS NOT HERE?🧐*
- Use the start pushing code to see changes 💻
- eg: if you have issues pushing code contact *Group Admins* for assistance
- make sure your "githuburl=" is set to your account URL
`);
};

exports.generateWelcome = function (
  contacts = [],
  botName = "Github Team Bot"
) {
  return (summary = `Welcome new member(s) 🎊🎉🎉
${contacts
      .map((member) => {
        return @${member.number} \n;
      })
      .join("")}

My name is ${botName}, I am the personal assistant here
*Please drop a quick introduction*

- Your name
- Your Level
- Course or Program
- Language framework(s) or technology you are learning
- A URL to your github account (so that all members can follow you)


*I can also assist you 🧐* 
use the !help command to find out more

Note🚀: To for me to recognize you, you *must* register as a member of this group run *!register name=YourName githuburl=https://githuburl.com/username* command to get started.
`);
};


exports.generatePollMessage = function (
  question,
  endsAt,
  options = [],
  contacts = [],
) {
  return (`📢 Poll - Ends ${moment(endsAt).fromNow()}

*Question*
${question}

*Options* (Reply with the option number)
${options.map((option, idx) => {
    return ${idx + 1} - ${option} \n
}).join("")}


${contacts
      .map((member) => {
        return @${member.number} ;
      })
      .join("")}
`);
};

exports.generatePollResultsMessage = function (
  question,
  options = [],
  answers = [],
  contacts = [],
) {
  const totalAnswers = answers?.reduce((a, b) => a + b, 0)
  return (`📢 Poll Results 🎊🎉

*Question*
${question}

*Options*
${options.map((option, idx) => {
    return ${idx + 1} - ${option} (${answers[idx] ? parseFloat((answers[idx]/totalAnswers) * 100).toFixed(2) : 0}%) \n
}).join("")}

*Total votes: ${totalAnswers}*

${contacts
      .map((member) => {
        return @${member.number} ;
      })
      .join("")}
`);
};