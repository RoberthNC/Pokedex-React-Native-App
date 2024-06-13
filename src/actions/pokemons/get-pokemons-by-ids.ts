import {getPokemonById} from './';
import {Pokemon} from '../../domain/entities/pokemon';

export const getPokemonsByIds = async (ids: number[]) => {
  try {
    const pokemonPromises: Promise<Pokemon>[] = ids.map(id => {
      return getPokemonById(id);
    });
    return Promise.all(pokemonPromises);
  } catch (error) {
    throw new Error(`Cannot get pokemons by ids: ${ids}`);
  }
};
