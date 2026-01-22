const listDiv = document.getElementById("list");
const nameTitle = document.getElementById("pokeName");
const spriteImg = document.getElementById("pokemonSprite");
const attackList = document.getElementById("attackList");
const genSelect = document.getElementById("genSelect");
const searchInput = document.getElementById("search");
const detail = document.getElementById("detail");

let radarChart;

const genRanges = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1017]
};

// Fondos estilo Pokémon Esmeralda (pixel)
const biomeBackgrounds = {
  grass: "https://archives.bulbagarden.net/media/upload/9/9e/Hoenn_Safari_Zone_RSE.png",
  fire: "https://archives.bulbagarden.net/media/upload/6/6b/Mt_Chimney_RSE.png",
  water: "https://archives.bulbagarden.net/media/upload/4/45/Hoenn_Route_134_RSE.png",
  electric: "https://archives.bulbagarden.net/media/upload/0/08/New_Mauville_RSE.png",
  ghost: "https://archives.bulbagarden.net/media/upload/1/1a/Pokemon_Tower_RSE.png",
  dragon: "https://archives.bulbagarden.net/media/upload/5/5f/Meteor_Falls_RSE.png",
  ice: "https://archives.bulbagarden.net/media/upload/8/87/Shoal_Cave_Ice_RSE.png",
  rock: "https://archives.bulbagarden.net/media/upload/3/3b/Route_111_Desert_RSE.png",
  ground: "https://archives.bulbagarden.net/media/upload/3/3b/Route_111_Desert_RSE.png",
  psychic: "https://archives.bulbagarden.net/media/upload/2/23/Mossdeep_City_RSE.png",
  bug: "https://archives.bulbagarden.net/media/upload/9/9e/Petalburg_Woods_RSE.png",
  fairy: "https://archives.bulbagarden.net/media/upload/7/7d/Route_120_RSE.png",
  fighting: "https://archives.bulbagarden.net/media/upload/5/5f/Meteor_Falls_RSE.png",
  poison: "https://archives.bulbagarden.net/media/upload/6/63/Fiery_Path_RSE.png",
  normal: "https://archives.bulbagarden.net/media/upload/7/7d/Route_101_RSE.png"
};

function setBiome(types) {
  const mainType = types[0].type.name;
  const bg = biomeBackgrounds[mainType] || biomeBackgrounds.normal;
  detail.style.backgroundImage = `url(${bg})`;
  detail.style.backgroundSize = "cover";
  detail.style.backgroundPosition = "center";
}

async function loadGen(gen) {
  listDiv.innerHTML = "";
  const [start, end] = genRanges[gen];

  for (let i = start; i <= end; i++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await res.json();

    const div = document.createElement("div");
    div.className = "poke-item";
    div.innerHTML = `<img src="${data.sprites.front_default}" width="40"> ${i}. ${data.name}`;
    div.onclick = () => showPokemon(data);
    listDiv.appendChild(div);
  }
}

function showPokemon(pokemon) {
  nameTitle.textContent = pokemon.name.toUpperCase();
  spriteImg.src = pokemon.sprites.front_default;

  // Fondo tipo Esmeralda
  setBiome(pokemon.types);

  // Sonido del Pokémon
  if (pokemon.cries && pokemon.cries.latest) {
    const cry = new Audio(pokemon.cries.latest);
    cry.play();
  }

  // Estadísticas
  const stats = pokemon.stats.map(s => s.base_stat);
  const labels = ["HP", "ATQ", "DEF", "ATQ ESP", "DEF ESP", "VEL"];

  if (radarChart) radarChart.destroy();
  radarChart = new Chart(document.getElementById("radarChart"), {
    type: 'radar',
    data: {
      labels: labels.map((l, i) => `${l}: ${stats[i]}`),
      datasets: [{
        data: stats,
        backgroundColor: "rgba(0,255,255,0.2)",
        borderColor: "#00ffff",
        pointBackgroundColor: "#00ffff"
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        r: {
          ticks: { display: false },
          pointLabels: { color: "white", font: { size: 12 } }
        }
      }
    }
  });

  // Ataques (Top 10)
  attackList.innerHTML = "";
  pokemon.moves.slice(0, 10).forEach(move => {
    const li = document.createElement("li");
    li.textContent = move.move.name;
    attackList.appendChild(li);
  });
}

genSelect.addEventListener("change", () => loadGen(genSelect.value));

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  document.querySelectorAll(".poke-item").forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(term) ? "flex" : "none";
  });
});

loadGen(1);
