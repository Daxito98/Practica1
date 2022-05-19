<script>
    window.app  = new Vue({
      el: '#user',
      data: {
        name:   '', //nombre de usuario (no se usa)
        familyName:   '',
        birthDate:   '',
        gender:   '',
        preferences: '',
        identifier:  50
      },
      methods:{
        addUser(){
          this.identifier++

          var gQL = `mutation{
                addUser(
                  identifier:"${this.identifier}",
                  name: "${this.name}",
                  familyName: "${this.familyName}",
                  birthDate: "${this.birthDate}",
                  gender: "${this.gender}",
                  preferences: "${this.preferences}")
                  {identifier}
          }`
          console.log(gQL)
          fetch('/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ query: gQL })
          })
                  .then(function(r){return r.json()})
                  .then(function(json){console.log(json)})
                  .catch(function(error){console.log(error)})
        },
      },
    })
  </script>