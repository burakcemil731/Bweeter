console.log('hello!!!');

//querySelector weil: nimmt einfach das Element von der Seite
const form = document.querySelector('form');
//ladebalken init.
const loaderElement = document.querySelector('.loader');

const bweetsElement = document.querySelector('bweets');

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/bweets' : 'https://server.burakcemil731.vercel.app/bweets';

loaderElement.style.display = '';

listAllBweets();

form.addEventListener('submit', (event) =>{
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const bweet = {
        name,
        content
    };

    console.log(bweet);
    //ladebalken nur sichtbar wenn man absendet, gleichzeitig das Formular verstecken
    form.style.display = 'none';
    loaderElement.style.display = '';
    
    //jetzt Daten senden zum Backend
    fetch(API_URL,{
        method: 'POST',
        body: JSON.stringify(bweet), //das obj. parsen damit server rafft
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
    .then(createdBweet =>{
        //console.log(createdBweet);
        form.reset();
        form.style.display = '';
        listAllBweets();
        //loaderElement.style.display = 'none';
    });
});

function listAllBweets(){
    bweetsElement.innerHTML = '';
    fetch(API_URL)
    .then(response => response.json())
    .then(bweets => {
        console.log(bweets);
        bweets.reverse(); //neuste bweets oben
        bweets.forEach(bweet =>{
            const div = document.createElement('div');

            const header = document.createElement('h3');
            header.textContent = bweet.name;

            const contents = document.createElement('p');
            contents.textContent = bweet.content;

            const date = document.createElement('small');
            date.textContent = new Date(bweet.created);

            div.appendChild(header);
            div.appendChild(contents);
            div.appendChild(date);

            bweetsElement.appendChild(div);
        });
        loaderElement.style.display = 'none';
    });
};