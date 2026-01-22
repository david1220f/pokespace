const listDiv = document.getElementById("list");
const nameTitle = document.getElementById("pokeName");
const spriteImg = document.getElementById("pokemonSprite");
const attackList = document.getElementById("attackList");
const genSelect = document.getElementById("genSelect");
const searchInput = document.getElementById("search");

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
  setBiome(pokemon.types);

  const stats = pokemon.stats.map(s => s.base_stat);
  const labels = ["HP", "ATQ", "DEF", "ATQ ESP", "DEF ESP", "VEL"];

  if (radarChart) radarChart.destroy();
  radarChart = new Chart(document.getElementById("radarChart"), {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: pokemon.name,
        data: stats,
        backgroundColor: "rgba(255,0,0,0.3)",
        borderColor: "red",
        pointBackgroundColor: "yellow"
      }]
    },
    options: {
      scales: {
        r: {
          ticks: { display: false },
          grid: { color: "#444" },
          angleLines: { color: "#444" }
        }
      }
    }
  });

  attackList.innerHTML = "";
  pokemon.moves.slice(0, 10).forEach(move => {
    const li = document.createElement("li");
    li.textContent = move.move.name;
    attackList.appendChild(li);
  });
const cry = new Audio(pokemon.cries.latest);
cry.play();
}

genSelect.addEventListener("change", () => loadGen(genSelect.value));

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  document.querySelectorAll(".poke-item").forEach(item => {
    item.style.display = item.textContent.includes(term) ? "flex" : "none";
  });
});

loadGen(1);
const detail = document.getElementById("detail");

// Fondos pixel por tipo (biomas)
const biomeBackgrounds = {
  fire: "https://i.imgur.com/6L6bKqN.gif",      // volcán pixel
  water: "https://i.imgur.com/7a8H3Zx.gif",     // océano pixel
  grass: "https://i.imgur.com/qz7JQ6G.gif",     // bosque pixel
  electric: "https://i.imgur.com/yvQZb0s.gif",  // central eléctrica pixel
  rock: "https://i.imgur.com/2s9ZyO0.gif",      // desierto pixel
  ground: "https://i.imgur.com/2s9ZyO0.gif",
  ice: "https://i.imgur.com/vcC5F7F.gif",       // glaciar pixel
  ghost: "https://i.imgur.com/LzJ0Y5C.gif",     // torre oscura pixel
  dragon: "https://i.imgur.com/0H8Qp2b.gif",
  normal: "https://i.imgur.com/9m7fK0L.gif",
  psychic: "https://i.imgur.com/4S4xk8f.gif",
  bug: "https://i.imgur.com/qz7JQ6G.gif",
  fairy: "https://i.imgur.com/VFZgG6o.gif",
  fighting: "https://i.imgur.com/2s9ZyO0.gif",
  poison: "https://i.imgur.com/4S4xk8f.gif"
};

function setBiome(types) {
  const mainType = types[0].type.name;
  const bg = biomeBackgrounds[mainType] || biomeBackgrounds.normal;
  detail.style.backgroundImage = `url(${bg})`;
}

