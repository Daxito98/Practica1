<script>
    window.app  = new Vue({
      el: '#event',
      data: {
        about:   '', //nombre de usuario (no se usa)
        startDate:   '',
        location:   '',
        duration:   ,
        identifier:  4
      },
      methods:{
        addEvent(){
          this.identifier++

          var gQL = `mutation{
                addEvent(
                  identifier:"${this.identifier}",
                  about: "${this.about}",
                  startDate: "${this.startDate}",
                  location: "${this.location}",
                  duration: "${this.duration}")
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