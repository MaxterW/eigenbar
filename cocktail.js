const SUPABASE_URL =
"https://jnizemsqcwescmagohuw.supabase.co";


const SUPABASE_KEY =
"sb_publishable_yBd-5ZjZPVUJRyLqhyq4IA_nIfYZAAK";


const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



const id =
Number(
new URLSearchParams(location.search)
.get("id")
);


function renderStars(value){

    let stars = "";

    for(let i = 1; i <= 5; i++){

        if(value >= i){

            stars += `<span class="full-star">★</span>`;

        }

        else if(value >= i - 0.5){

            stars += `<span class="half-star">★</span>`;

        }

        else{

            stars += `<span class="empty-star">☆</span>`;

        }

    }

    return stars;

}





async function loadCocktail(){



    const cocktails =
    await fetch("cocktails.json")
    .then(r=>r.json());



    const cocktail =
    cocktails.find(c=>c.id===id);



    document.getElementById("cocktail")
    .innerHTML = `



    <h1>
    ${cocktail.name}
    </h1>


    <p>
    ${cocktail.description}
    </p>



    <h3>
    Zutaten
    </h3>


    <ul>

    ${cocktail.ingredients
    .map(i=>`
    <li>${i.name}</li>
    `)
    .join("")}

    </ul>



    <p>
    Kategorie:
    ${cocktail.category}
    </p>



    <p>
    Alkohol:
    ${cocktail.alcohol_pc} %
    </p>



    `;


}







async function loadRatings(){



    const {data,error} =
    await supabaseClient
    .from("ratings")
    .select("*")
    .eq("cocktail_id",id)
    .order(
        "created_at",
        {
            ascending:false
        }
    );



    if(error){

        console.log(error);
        return;

    }



    document.getElementById("ratings")
    .innerHTML =


    data.map(r=>`


    <div class="rating">


    <b>
    ${r.name}
    </b>


    <br>


    ${renderStars(r.rating)}



    <p>
    ${r.comment}
    </p>


    </div>


    `).join("");



}






console.log("Rating-Form gefunden");

document
.getElementById("ratingForm")
.addEventListener(
"submit",
async e=>{


e.preventDefault();



await supabaseClient
.from("ratings")
.insert({

    cocktail_id:id,

    name:
    document.getElementById("name").value,


    rating:
    Number(
    document.getElementById("rating").value
    ),


    comment:
    document.getElementById("comment").value

});



location.reload();


});





loadCocktail();

loadRatings();