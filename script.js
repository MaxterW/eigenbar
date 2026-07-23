const SUPABASE_URL = "https://jnizemsqcwescmagohuw.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_yBd-5ZjZPVUJRyLqhyq4IA_nIfYZAAK";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

fetch("cocktails.json")
.then(response => response.json())
.then(data => {

let container =
document.getElementById("cocktails");


data.forEach(drink => {

container.innerHTML += `

<div class="card">

<h2>${drink.name}</h2>

<ul>
${drink.zutaten.map(x=>`<li>${x}</li>`).join("")}
</ul>

<form onsubmit="submitRating(event, ${drink.id})">

<input 
id="name-${drink.id}"
placeholder="Dein Name">

<br>

<select id="rating-${drink.id}">
<option value="5">★★★★★</option>
<option value="4">★★★★</option>
<option value="3">★★★</option>
<option value="2">★★</option>
<option value="1">★</option>
</select>

<br>

<textarea 
id="comment-${drink.id}"
placeholder="Kommentar">
</textarea>

<br>

<button>
Absenden
</button>

</form>

<div id="ratings-${drink.id}"></div>

</div>

`;

});

});

async function submitRating(event, cocktailId){

event.preventDefault();


let name =
document.getElementById(`name-${cocktailId}`).value;


let rating =
document.getElementById(`rating-${cocktailId}`).value;


let comment =
document.getElementById(`comment-${cocktailId}`).value;


const {error} = await supabaseClient
.from("ratings")
.insert([
{
cocktail_id: cocktailId,
name:name,
rating:rating,
comment:comment
}
]);


if(error){
    console.error("Supabase Fehler:", error);
    alert("Fehler: " + error.message);
}
else{
    alert("Danke für deine Bewertung!");
}

}
