document.addEventListener('DOMContentLoaded', () => {
    fetchdata();
});

const fetchdata = async () => {
    try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
        const data = await res.json();
        const promises = data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
        });
        const detailedPokemonData = await Promise.all(promises);
        
        // Ordena por ID
        const sortedPokemonData = detailedPokemonData.sort((a, b) => a.id - b.id);


        sortedPokemonData.forEach(pokemon => dataCard(pokemon));
    } catch (error) {
        console.log(error);
    }
};

const fetchWeakness = async (typeUrl) => {
    try {
        const res = await fetch(typeUrl);
        const typeData = await res.json();
        const weaknesses = typeData.damage_relations.double_damage_from.map(type => type.name);
        return weaknesses.slice(0, 2).join(', '); // Limita a 2 las debilidades
    } catch (error) {
        console.log(error);
    }
};
const dataCard = async (pokemon) => {
    const flex = document.querySelector('.flex');
    const template = document.querySelector('#template-card').content;
    const clone = template.cloneNode(true);
    const fragment = document.createDocumentFragment();

    const pokemonTypes = pokemon.types.map(type => type.type.name).join(', ');
    const weaknesses = await fetchWeakness(pokemon.types[0].type.url);

    clone.querySelector('.card-body-img').setAttribute('src', pokemon.sprites.other['official-artwork'].front_default);
    clone.querySelector('.card-body-name').innerHTML = `#${pokemon.id} <span>${pokemon.name}</span>`;
    clone.querySelector('.card-body-text').textContent = pokemonTypes;
    clone.querySelector('.card-footer-power p').textContent = pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat;
    clone.querySelector('.card-footer-debility p').textContent = weaknesses;
    clone.querySelector('.card-footer-peso p').textContent = `${pokemon.weight} KG`;

    fragment.appendChild(clone);
    flex.appendChild(fragment);
};

