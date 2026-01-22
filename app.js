const listDiv = document.getElementById("list");
const nameTitle = document.getElementById("pokeName");
const spriteImg = document.getElementById("pokemonSprite");
const attackList = document.getElementById("attackList");
const genSelect = document.getElementById("genSelect");
const searchInput = document.getElementById("search");
const detail = document.getElementById("detail");

let radarChart;

// Rangos por generación
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

// Fondos pixel tipo bioma
const biomeBackgrounds = {
  fire: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/volcano.gif",
  water: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/ocean.gif",
  grass: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/forest.gif",
  electric: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/powerplant.gif",
  rock: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/desert.gif",
  ground: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/desert.gif",
  ice: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/snow.gif",
  ghost: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/haunted.gif",
  dragon: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/mountain.gif",
  normal: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/field.gif",
  psychic: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/space.gif",
  bug: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/forest.gif",
  fairy: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/magic.gif",
  fighting: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/mountain.gif",
  poison: "https://raw.githubusercontent.com/itsrealfarhan/pixel-art-biomes/main/swamp.gif"
};

function setBiome(types) {
  const mainType = types[0].type.name;
  const bg = biomeBackgrounds[mainType] || biomeBackgrounds.normal;
  detail.style.backgroundImage = `url(${bg})`;
  detail.style.backgroundSize = "cover";
  detail.style.backgroundPosition = "center";
}

// Cargar generación
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

// Mostrar Pokémon
function showPokemon(pokemon) {
  nameTitle.textContent = pokemon.name.toUpperCase();
  spriteImg.src = pokemon.sprites.front_default;

  // Fondo por bioma
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
        label: pokemon.name,
        data: stats,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderColor: "#00ffcc",
        pointBackgroundColor: "#00ffcc"
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        r: {
          ticks: { display: false },
          grid: { color: "#888" },
          angleLines: { color: "#888" },
          pointLabels: {
            color: "white",
            font: { size: 12 }
          }
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

// Selector de generación
genSelect.addEventListener("change", () => loadGen(genSelect.value));

// Buscador
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  document.querySelectorAll(".poke-item").forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(term) ? "flex" : "none";
  });
});

// Cargar Gen 1 por defecto
loadGen(1);
