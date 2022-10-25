const pokedex = document.querySelector('.pokedex-container');
const startingOptionEl = document.querySelector('.filter');
const btn1gen = document.querySelector('.btn-fetch--1-gen');
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

btn1gen.addEventListener('click', showAll1stGen);

for (const color in colors) {
	const option = document.createElement('button');
	option.classList.add('btn');
	option.classList.add('btn-fetch');
	option.innerText = color;
	option.style.backgroundColor = colors[color];

	option.addEventListener('click', filterPokemon);

	startingOptionEl.append(option);
}

async function fetch1stGen() {
	resetPokedex();
	for (let i = 1; i <= COUNT_1_GEN; i++) {
		await getPokemon(i);
	}
}

async function getPokemon(id) {
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const results = await fetch(url);
	const data = await results.json();

	cashToLocalStorage(data);
}

function cashToLocalStorage(data) {
	const { id, name, forms, sprites, types } = data;

	const pokemonData = {
		id: id,
		name: name,
		forms: forms,
		sprite: sprites.front_default,
		types: types,
	};
	localStorage.setItem(id, JSON.stringify(pokemonData));
}

function createPokeData() {
	let allPokemon = [];

	for (let i = 1; i <= COUNT_1_GEN; i++) {
		const currentPoke = localStorage.getItem(i);
		allPokemon.push(JSON.parse(currentPoke));
	}

	return allPokemon;
}

function resetPokedex() {
	pokedex.innerHTML = '';
}

async function filterPokemon(e) {
	resetPokedex();
	const clickedType = e.target.innerText;

	let filteredPoke = [];

	all1stGenPokemon.forEach((obj) => {
		for (let i = 0; i < obj.types.length; i++) {
			if (obj.types[i].type.name === clickedType) {
				filteredPoke.push(obj);
			}
		}
	});

	filteredPoke.forEach((poke) => createPokemonCard(poke));
}

function createPokemonCard(pokemon) {
	const cardEl = document.createElement('div');
	cardEl.classList.add('pokemon');

	console.log(pokemon);

	const pokeTypes = pokemon.types.map(
		(type) =>
			`<span style="background-color: ${colors[type.type.name]}">${
				type.type.name
			}</span>`
	);

	console.log(pokeTypes);

	const cardTemplate = `
	   <div class="img-container">
			<img
				src="${pokemon.sprite}"
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

function showAll1stGen() {
	all1stGenPokemon.forEach((poke) => createPokemonCard(poke));
}

fetch1stGen();
const all1stGenPokemon = createPokeData();
