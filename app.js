<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Pokedex Pixel</title>
<style>
body {
  background:#111;
  color:white;
  font-family:Arial;
}

#pokemon-box {
  display: inline-block;
  padding: 12px;
  border: 3px solid white;
  border-radius: 8px;
  text-align: center;
  margin: 20px;
  background-size: cover;
  image-rendering: pixelated;
}

/* Colores por tipo */
.type-grass { background:#2f7f3f; }
.type-fire { background:#9f2f1f; }
.type-water { background:#1f4f9f; }
.type-electric { background:#bfa500; }
.type-ghost { background:#3f2f6f; }
.type-ice { background:#5fbfbf; }
.type-dragon { background:#6f2f1f; }
.type-normal { background:#666; }

.pixel {
  image-rendering: pixelated;
}
</style>
</head>

<body>

<div id="pokemon-box">
  <h1 id="name">Cargando...</h1>
  <img id="sprite" class="pixel" width="96">
</div>

<script>
async function loadPokemon(id) {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + id);
  const pokemon = await res.json();

  const nameEl = document.getElementById("name");
  const spriteEl = document.getElementById("sprite");
  const box = document.getElementById("pokemon-box");

  const mainType = pokemon.types[0].type.name;
  const typesText = pokemon.types.map(t => t.type.name).join(" / ");

  nameEl.textContent = pokemon.name.toUpperCase() + " (" + typesText + ")";
  spriteEl.src = pokemon.sprites.front_default;

  box.className = "";
  box.classList.add("type-" + mainType);
}

loadPokemon(1); // Bulbasaur
</script>

</body>
</html>
