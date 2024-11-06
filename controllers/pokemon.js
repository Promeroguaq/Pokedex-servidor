const Pokemon = require('../models/pokemon')
const {fetchPokemon} = require("../services/fetch")
exports.hiTrainer = async (req,res)=>{
    try {
        res.send("Hola entrenador ahora desde el controlador")
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

exports.createPokemon = async (req,res) =>{
    try {
        console.log(req.body)
        const pokemon = new Pokemon(req.body)
        await pokemon.save()
        res.status(201).json(pokemon)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

exports.getPokemons = async (req,res) =>{
    try {
        const pokemones = await Pokemon.find()
        //A futuro vamos a tener que implementar una logica que nos busque las caracteristicas en Pokeapi
        res.status(200).json(pokemones)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

exports.getPokemonByIdPokemon = async (req,res)=>{
    try {
        const pokemonID = req.params.pokemon_id
        let pokemon = await Pokemon.findOne({"pokemon_id":pokemonID})
        //A futuro vamos a tener que implementar una logica que nos busque las caracteristicas en Pokeapi
        if(!pokemon){
            pokemon = {
                pokemon_id:pokemonID,
                view:false,
                catch:false,
                in_team:false
            }
            const pokemonData = await fetchPokemon(pokemonID,pokemon)
            if(!pokemonData){
                return res.status(404).json({message:"pokemon not find"})
            }
            console.log(pokemonData)
            return res.status(200).json(pokemonData)
        }
        const pokemonData = await fetchPokemon(pokemonID,pokemon)
        res.status(200).json(pokemonData)
    } catch (error) {
        res.status(500).json({error:error.message})        
    }
}
