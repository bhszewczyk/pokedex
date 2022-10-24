const pokedex = document.querySelector('.pokedex-container');
const COUNT_1_GEN = 151;
const colors = {
	grass: '#cdeac0',
	fire: '#f9c6c9',
	water: '#c6def1',
	poison: '#dbcdf0',
	electric: '#faedcb',
	ground: '#e2cfc4',
	normal: '#f8f7ff',
	flying: '#a0ced9',
	bug: '#acd8aa',
	fairy: '#f7aef8',
	fighting: '#ffac81',
	psychic: '#ffc2d1',
	rock: '#d2d2cf',
	steel: '#e2e2df',
	ice: '#ddfdfe',
	ghost: '#b9b5ff',
	dragon: '#9ba9ff',
};

async function fetchPokemons() {
	for (let i = 1; i <= COUNT_1_GEN; i++) {
		await getPokemon(i);
	}
}

async function getPokemon(id) {
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const results = await fetch(url);
	const data = await results.json();

	console.log(data);

	createPokemonCard(data);
}

function createPokemonCard(pokemon) {
	const cardEl = document.createElement('div');
	cardEl.classList.add('pokemon');

	const pokeTypes = pokemon.types.map(
		(type) =>
			`<span style="background-color: ${colors[type.type.name]}">${
				type.type.name
			}</span>`
	);

	const cardTemplate = `
      <div class="img-container">
			<img
				src="${pokemon.sprites.front_default}"
						alt="${pokemon.name} image"
			/>
		</div>
		<div class="info">
			<span class="number">#${
				pokemon.id < 10
					? '00' + pokemon.id
					: pokemon.id >= 10 && pokemon.id < 100
					? '0' + pokemon.id
					: pokemon.id
			}</span>
			<h3 class="name">${pokemon.name}</h3>
			<small class="type">Type(s):${pokeTypes.join('')}</small>
		</div>
   `;

	cardEl.innerHTML = cardTemplate;

	pokedex.append(cardEl);
}

fetchPokemons();
