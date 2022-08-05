const miFormulario = document.querySelector('form');


const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8090/api/auth/'
    : 'https://restserver-curso-fher.herokuapp.com/api/auth/';


miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for (let el of miFormulario.elements) {
        if (el.name.length > 0)
            formData[el.name] = el.value
    }
    console.log(formData);

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(({ err, token }) => {
            if (err) {
                return console.error(err);
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(err => {
            console.log(err)
        })

});

function handleCredentialResponse(response) {

    const body = { id_token: response.credential };

    fetch(url + 'google', {
        method: 'POST', //POR DEFECTO ES UN GET UN FETCH
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(/*resp*/({ token }) => {
            //console.log(resp)                        
            //localStorage.setItem('email', resp.usuario.correo)
            console.log(token);
            //lo guardamos en el localStorage
            localStorage.setItem('token', token);
            window.location = 'chat.html';

        })
        .catch(console.warn);
}

const button = document.getElementById('google_signout');
button.onclick = () => {
    console.log(google.accounts.id)
    google.accounts.id.disableAutoSelect()


    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}