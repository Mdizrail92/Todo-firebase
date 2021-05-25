var firebaseConfig = {
    apiKey: "AIzaSyApPXUFGzeWdGJV5o2jAM-Mlge_tlsN7uc",
    authDomain: "firestore-tut-922f4.firebaseapp.com",
    projectId: "firestore-tut-922f4",
    storageBucket: "firestore-tut-922f4.appspot.com",
    messagingSenderId: "479460416997",
    appId: "1:479460416997:web:ca7bf77699d6c8aa04a30c",
    measurementId: "G-QJYN9DXNWB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
db.settings({
    timestampsInSnapshot: true
});

const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// create element and render cafe
function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');
    
    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) =>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    })
}

// // getting data
// db.collection('cafes').orderBy('name').get().then((snapshot) =>{
//     snapshot.docs.forEach(doc =>{
//         renderCafe(doc);
//     })
// });


// saving data
form.addEventListener('submit', (e) =>{
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
});

// Real time listener
db.collection('cafes').orderBy('name').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    })
})