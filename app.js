//Récupérer les éléments nécessaires du DOM
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const nameOutput = document.querySelector('.name');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const icon = document.querySelector('.icon');

const form = document.querySelector('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');


const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');

//Ville par défaut au chargement de la page
let cityInput = "London";

//Ajout d'un évenement au click
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML; //Changer la ville par défaut à celle cliquée
        fetchWeatherData(); //Fonction qui récupère et affiche les données de l'API
        app.style.opacity = "0"; //Animation de fade-out de l'app
    });
})

//Ajout d'un évenement Submit au formulaire
window.addEventListener("DOMContentLoaded", (event) => {
    form.addEventListener('submit', (e) => {
        if(search.value.length == 0) {
            alert("Champ vide") //Si le champ est vide, envoyer alerte
        } else {
            cityInput = search.value;
            fetchWeatherData();
            search.value = "";
            app.style.opacity = "0";
        }
        e.preventDefault();
    });
});

// Fonction qui retourne le jour de la semaine d'une date
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};

//Ecriture de la fonction fetchWeatherData
function fetchWeatherData() {
    fetch('http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=5efe3c7e31aff65ceffcd1581f962056')
    //Conversion des données du format JSON en objet JS standard
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Ajout de la température et des conditions météo à la page
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;

        //Prendre la date et l'heure de la ville et extraire le jour, mois, année et heure vers des variables individuelles
        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));
        const time = date.substr(11);

        //Changer le format de la date vers qquechose de plus présentable + l'ajouter à la page
        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
        timeOutput.innerHTML = time; 
        //Ajout du nom de la ville à la page
        nameOutput.innerHTML = data.location.name;
        //Récupérer l'URL de l'icone pour la météo et en extraire une partie
        const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
        //Transformer l'url de l'icone en chemin d'accès de dossier standard et l'ajouter à la page 
        icon.src = "./icons/" + iconId;

        //Ajout des "Details de la météo" à la page
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        //Fixer le temps par défaut sur jour
        let timeOfDay = "day";
        //Récupérer l'id unique pour chaque condition météo
        const code = data.current.condition.code;
        
        //Changer en nuit si l'heure de la ville correspond à un temps de nuit
        if(!data.current.is_day) {
            timeOfDay = "night";
        }

        if(code === 1000) {
            //Mettre le bg en clair si la météo est claire
            app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`; 
            //Changer le bg color du bouton dépendemment de s'il fait jour ou nuit
            btn.style.background = "#e5ba92";
            if(timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        }

        //On répète la même chose pour le temps nuageux
        else if (
            code == 1003 ||
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282
        ) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
            btn.style.background = "#fa6d1b";
            if(timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        } 

        //On répète la même chose pour le temps pluvieux
        else if (
            code == 1063 ||
            code == 1069 ||
            code == 1072 ||
            code == 1150 ||
            code == 1153 ||
            code == 1180 ||
            code == 1183 ||
            code == 1186 ||
            code == 1189 ||
            code == 1192 ||
            code == 1195 ||
            code == 1204 ||
            code == 1207 ||
            code == 1240 ||
            code == 1243 ||
            code == 1246 ||
            code == 1249 ||
            code == 1252
        ) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
            btn.style.background = "#647d75";
            if(timeOfDay == "night") {
                btn.style.background = "#325c80";
            }
        } 

        //Et pour le temps neigeux
        else {
            app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
            btn.style.background = "#4d72aa";
            if(timeOfDay == "night") {
                btn.style.background = "#1b1b1b";
            }
        }
        //Afficher la page quand tout ça est fait
        app.style.opacity = "1";        
    })
    //Si l'utilisateur saisi une ville qui n'existe pas, alerte 
    .catch(() => {
        alert("Ville non trouvée, veuillez réessayer");
        app.style.opacity = "1";
    });
}

//Appeler la fonction au chargement de la page
fetchWeatherData();

//Afficher la page
app.style.opacity = "1";