
const Pokemon = require('../models/pokemon')
const {fetchPokemon} = require("../services/fetch")

exports.viewPokemonById = async (req,res) =>{
    try {
        const pokemon_id = req.params.pokemon_id
        const pokemon_status = req.body.catch
        if(pokemon_status){
           return res.status(400).json({message:"Bad pokemon status"})
        }
        const pokemonNew = {
            pokemon_id:pokemon_id,
            view:true,
            catch:false,
            in_team:false
        }
        const filter ={pokemon_id:pokemon_id}
        const pokemon = await Pokemon.findOneAndReplace(filter,pokemonNew,{new:true})
        if(!pokemon){
            return res.status(404).json({message:"Pokemon not find"})
        }
        const pokemonData = await fetchPokemon(pokemon_id,pokemon)
        res.status(200).json(pokemonData)
    } catch (error) {
        res.status(500).json({error:error.message})        
    }
}

exports.catchPokemonById = async (req,res)=>{
    try {
        const pokemon_id = req.params.pokemon_id
        const pokemonStatusView = req.body.view
        const pokemonStatusInTeam = req.body.in_team
        if(pokemonStatusInTeam){
            return res.status(400).json({message:"Bad pokemon status, pokemon in team"})
        }
        if(pokemonStatusView){
            const pokemonNew = {
                pokemon_id:pokemon_id,
                view:true,
                catch:true,
                in_team:false
            }
            const filter = {pokemon_id:pokemon_id}
            const pokemon = await Pokemon.findOneAndReplace(filter,pokemonNew,{new:true})
            if(!pokemon){
                return res.status(404).json({message:"Pokemon not found"})
            }
            const pokemonData = await fetchPokemon(pokemon_id,pokemon)
            return res.status(200).json(pokemonData)
        }else{
            return res.status(400).json({message:"Bad pokemon status"})
        }
    } catch (error) {
        res.status(500).json({error:error.message})           
    }
   
}

exports.inTeamPokemonById = async (req,res)=>{
    try {
        const pokemon_id = req.params.pokemon_id
        const pokemonStatusView = req.body.view
        const pokemonStatusCatch = req.body.catch
        const pokemonStatusInTeam = req.body.in_team
        if(pokemonStatusCatch && pokemonStatusView){
            const filter ={pokemon_id:pokemon_id}
            const pokemon = await Pokemon.findOne(filter)
            if(!pokemon){
                return res.status(404).json({message:"Pokemon not find"})
            }
            if(pokemon.in_team == pokemonStatusInTeam){
                pokemon.in_team = !pokemonStatusInTeam
                await pokemon.save()
                const pokemonData = await fetchPokemon(pokemon_id,pokemon)
                return res.status(200).json(pokemonData)
            }else{
                return res.status(400).json({message:"Bad pokemon status"})
            }
         }else{
            return res.status(400).json({message:"Bad pokemon status"})
         }         
     } catch (error) {
         res.status(500).json({error:error.message})        
     }
}
