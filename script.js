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

<button>
Bewerten
</button>

</div>

`;

});

});
