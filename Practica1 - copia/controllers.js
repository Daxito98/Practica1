require('my-graph.json')


const { graphql, buildSchema } = require('graphql')



const model = require('./model') //Database

let DB
model.getDB().then(db => {DB=db})


const sse  = require('./utils/notifications') //Notifications
sse.start()


const schema = buildSchema(`
  type Query {
    users: [User]
    events: [Event]
    searchUser(idUser:ID!):[User]
    searchEvent(idEvent:ID!):[Event]
    searchUsersInEvent(idEvent:ID!):[User]
    searchEventsInUser(idUser:ID!):[Event]
  }
  
  type Mutation {
    addUser(identifier:ID!,name:String!,familyName:String!,birthDate:String!,gender:String!,preferences:String!):User!
    addEvent(identifier:ID!,about:String!,startDate:String!,location:String!,duration:Int!):Event!
  }
  
  type User{
	name: String
    familyName: String
    performerIn: [Event]
    birthDate: String
    gender: String
    preferences: String
  }

  type Event{
	about: String
    attendee: [User]
    startDate: String
	location: String
	duration: Int
  }
`)


const rootValue = {
     users : () => DB.objects('User'),
     events : () => DB.objects('Event'),
     searchEvent: ({ idEvent }) => {
       return DB.objects('Event').filter(x => x.identifier.includes(idEvent))
     },
    searchUser: ({ idUser }) => {
        return DB.objects('User').filter(x => x.identifier.includes(idUser))
    },
    searchUsersInEvent: ({ idEvent }) => {
        return  DB.objects('Event').filter(x => x.identifier.includes(idEvent)).attendee
    },
    searchEventsInUser: ({ idUser }) => {
        return  DB.objects('User').filter(x => x.identifier.includes(idUser)).performerIn
    },
    searchNearEvents:({}) => {
        return DB.objects('Event').filter(x =>x.identifier.includes(startDate))
    },
    addUser: ({ name, familyName, birthDate, gender, preferences}) => {

        let user = {
            name: name,
            familyName: familyName,
            birthDate: birthDate,
            gender: gender,
            preferences: preferences,
            performerIn: []
        }

        DB.write( () => { DB.create('User', user) })

        // SSE notification (same view as in graphQL)
        let post = {name: user.name, familyName: user.familyName, birthDate: user.birthDate, gender: user.gender, preferences: user.preferences}
        sse.emitter.emit('new-post', post)
        return user
    },

    addEvent: ({ about, startDate, location, duration}) => {

        let event = {
            about: about,
            attendee: [],
            startDate: startDate,
            location: location,
            duration: duration,

        }

        DB.write( () => { DB.create('Event', event) })

        // SSE notification (same view as in graphQL)
        let post = {about: event.about, startDate: event.startDate, location: event.location, duration: event.duration}
        sse.emitter.emit('new-post', post)
        return event
    }
}

exports.root   = rootValue
exports.schema = schema
exports.sse    = sse


/*
mutation {
  addUser(identifier: 5, name: "Daniel", familyName: "Alarcon", birthDate: "29Octubre1998", gender: "Hombre", preferences: "Fiesta") {
    identifier
    name
    familyName
    birthDate
    gender
    preferences
  }
}


query{
  users{
    identifier
		name
    familyName
    performerIn {
      about
      startDate
      location
      duration
    }
    birthDate
    gender:
    preferences
  }
}

 */
