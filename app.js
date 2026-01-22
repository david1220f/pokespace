<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Pokédex Pixel Pro</title>
<style>
body {
  margin: 0;
  font-family: monospace;
  background: #000;
  color: white;
}

#app {
  display: flex;
  height: 100vh;
}

#list {
  width: 250px;
  background: #111;
  overflow-y: auto;
  border-right: 3px solid #0f0;
}

#list div {
  padding: 8px;
  cursor: pointer;
}

#list div:hover {
  background: #222;
}

#detail {
  flex: 1;
  padding: 20px;
  background-size: cover;
  background-position: center;
  image-rendering: pixelated;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 10px 0;
}

.stat {
  background: rgba(0,0,0,0.6);
  padding: 5px;
  border-radius: 5px;
  text-align: center;
}

#radar {
  width: 300px;
  height: 300px;
  margin: 10px 0;
}

ul {
  columns: 2;
}

.pixel {
  image-rendering: pixelated;
}
</style>
</head>
<body>

<div id="app">
  <div id="list"></div>
  <div id="detail">
    <h1 id="name">Selecciona un Pokémon</h1>
    <img id="sprite" class="pixel" width="96"><br>

    <div class="stats" id="stats"></div>

    <canvas id="radar"></canvas>

    <h3>Ataques principales</h3>
    <ul id="moves"></ul>
  </div>
</div>

<script>
const biome = {
  grass: "repeating-linear-gradient(45deg,#1f5f1f 0px,#1f5f1f 16px,#2f8f2f 16px,#2f8f2f 32px)",
  fire: "repeating-linear-gradient(45deg,#7f1f1f 0px,#7f1f1f 16px,#ff5f00 16px,#ff5f00 32px)",
  water: "repeating-linear-gradient(45deg,#1f3f7f 0px,#1f3f7f 16px,#1f7fff 16px,#1f7fff 32px)",
  electric: "repeating-linear-gradient(45deg,#7f7f1f 0px,#7f7f1f 16px,#ffff3f 16px,#ffff3f 32px)",
  ghost: "repeating-linear-gradient(45deg,#2f1f4f 0px,#2f1f4f 16px,#5f3f9f 16px,#5f3f9f 32px)",
  dragon: "repeating-linear-gradient(45deg,#3f1f1f 0px,#3f1f1f 16px,#7f3f3f 16px,#7f3f3f 32px)",
  ice: "repeating-linear-gradient(45deg,#1f7f7f 0px,#1f7f7f 16px,#7fffff 16px,#7fffff 32px)",
  normal: "repeating-linear-gradient(45deg,#333 0px,#333 16px,#555 16px,#555 32px)"
};

const list = document.getElementById("list");
const detail = document.getElementById("detail");
const nameEl = document.getElementById("name");
const sprite = document.getElementById("sprite");
const statsEl = document.getElementById("stats");
const movesEl = document.getElementById("moves");
const radar = document.getElementById("radar");
const ctx = radar.getContext("2d");

fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
.then(r => r.json())
.then(data => {
  data.results.forEach((p,i) => {
    const div = document.createElement("div");
    div.textContent = (i+1) + ". " + p.name;
    div.onclick = () => loadPokemon(p.url);
    list.appendChild(div);
  });
});

function loadPokemon(url){
  fetch(url).then(r=>r.json()).then(pokemon=>{
    nameEl.textContent = pokemon.name.toUpperCase();
    sprite.src = pokemon.sprites.front_default;

    const type = pokemon.types[0].type.name;
    detail.style.background = biome[type] || biome.normal;

    const cry = new Audio(pokemon.cries.latest);
    cry.play();

    statsEl.innerHTML = "";
    pokemon.stats.forEach(s=>{
      const d = document.createElement("div");
      d.className = "stat";
      d.innerHTML = `<b>${s.stat.name.toUpperCase()}</b><br>${s.base_stat}`;
      statsEl.appendChild(d);
    });

    drawRadar(pokemon.stats.map(s=>s.base_stat));

    movesEl.innerHTML = "";
    pokemon.moves.slice(0,10).forEach(m=>{
      const li = document.createElement("li");
      li.textContent = m.move.name;
      movesEl.appendChild(li);
    });
  });
}

function drawRadar(values){
  radar.width = 300;
  radar.height = 300;
  ctx.clearRect(0,0,300,300);
  ctx.translate(150,150);

  const max = 150;
  ctx.beginPath();
  values.forEach((v,i)=>{
    const angle = (Math.PI*2/values.length)*i;
    const r = v;
    const x = Math.cos(angle)*r;
    const y = Math.sin(angle)*r;
    if(i==0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.closePath();
  ctx.strokeStyle = "cyan";
  ctx.stroke();
  ctx.fillStyle = "rgba(0,255,255,0.3)";
  ctx.fill();
  ctx.setTransform(1,0,0,1,0,0);
}
</script>
</body>
</html>
