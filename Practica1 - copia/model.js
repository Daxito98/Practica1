const Realm = require('realm')
const ObjectId = require('bson-objectid')
const app = new Realm.App({ id: "application-0-xniet" })
const myPartitionKey = "myAppPartition"


let UserSchema = {
   name: 'User',
   primaryKey: '_id',
   properties: {
     _id: 'objectId',
     _partition: 'string',
      name: 'string',
      familyName: 'string',
      birthDate: 'string',
      gender: 'string',
      preferences: 'string',
      performerIn: 'Event[]'
   }
}

let EventSchema = {
  name: 'Event',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    about: 'string',
    attendee: 'User[]',
    startDate: 'string',
    location: 'string',
    duration: 'int'
  }
}

// // // MODULE EXPORTS

let sync = {user: app.currentUser, partitionValue: myPartitionKey}

let config = {sync: sync, schema: [UserSchema, EventSchema]}

exports.getDB = async () => {
  await app.logIn(new Realm.Credentials.anonymous())
  return await Realm.open(config)
}





// // // // // 

if (process.argv[1] == __filename){ //TESTING PART

  if (process.argv.includes("--create")){ //crear la BD

      Realm.deleteFile({path: './data/DaniCarlosEvents.realm'})

      let DB = new Realm({
        path: './data/DaniCarlosEvents.realm',
        schema: [UserSchema, EventSchema]
      })
     
      DB.write(() => {
          let v = []
        let user = DB.create('User', {
            _id: ObjectId(),
            _partition: myPartitionKey,
            name: 'Usuario0',
            familyName: 'Apellido',
            performerIn: v,
            birthDate: new Date('Jul 12 2011').toString(),
            gender: 'Hombre',
            preferences: 'Fiesta, Cine'
        })

        let event = DB.create('Event', {
                                        _id: ObjectId(),
                                        _partition: myPartitionKey,
                                        about: 'Cumpleaños',
                                        attendee: [],
                                        startDate: new Date('Jul 12 2022').toString(),
                                        location: 'Castellon',
                                        duration: 30
        })

        console.log('Inserted objects', user, event)
      })
      DB.close()

  }
  else { //consultar la BD

      Realm.open({ path: './data/DaniCarlosEvents.realm' , schema: [UserSchema, EventSchema] }).then(DB => {
        let users = DB.objects('User')
        users.forEach(x => console.log(x.name))
        let event = DB.objectForPrimaryKey('Event', '0')
        if (event)
           console.log(event.about, ' in ', event.location)
        DB.close()
      })
  }
  
}
exports.partitionKey = myPartitionKey

exports.app = app


