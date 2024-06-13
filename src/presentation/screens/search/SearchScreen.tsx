import {useEffect, useMemo, useState} from 'react';
import {FlatList, View} from 'react-native';
import {globalTheme} from '../../../config/theme/global-theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextInput, ActivityIndicator, Text} from 'react-native-paper';
import {Pokemon} from '../../../domain/entities/pokemon';
import {PokemonCard} from '../../components/pokemons/PokemonCard';
import {useQuery} from '@tanstack/react-query';
import {
  getPokemonNamesWithId,
  getPokemonsByIds,
} from '../../../actions/pokemons';
import {FullScreenLoader} from '../../components/ui/FullScreenLoader';

export const SearchScreen = () => {
  const {top} = useSafeAreaInsets();
  const [term, setTerm] = useState('');

  const {isLoading, data: pokemonNameList = []} = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: () => getPokemonNamesWithId(),
  });

  //TODO: Apply debouncer
  const pokemonNameIdList = useMemo(() => {
    if (!isNaN(Number(term))) {
      const pokemon = pokemonNameList.find(
        pokemon => pokemon.id === Number(term),
      );
      return pokemon ? [pokemon] : [];
    }
    if (term.length === 0) return [];
    if (term.length < 3) return;
    return pokemonNameList.filter(pokemon =>
      pokemon.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()),
    );
  }, [term]);

  const {isLoading: isLoadingPokemons, data: pokemons = []} = useQuery({
    queryKey: ['pokemons', 'by', pokemonNameIdList],
    queryFn: () =>
      getPokemonsByIds(pokemonNameIdList!.map(pokemon => pokemon.id)),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <FullScreenLoader />;

  return (
    <View style={[globalTheme.globalMargin, {paddingTop: top + 10}]}>
      <TextInput
        placeholder="Search pokemon"
        mode="flat"
        autoFocus
        autoCorrect={false}
        onChangeText={setTerm}
        value={term}
      />

      {isLoadingPokemons && <ActivityIndicator style={{paddingTop: 20}} />}

      <FlatList
        style={{paddingTop: top + 20}}
        numColumns={2}
        data={pokemons}
        keyExtractor={(item, index) =>
          item.id.toString().concat((index + 1).toString())
        }
        renderItem={({item}) => <PokemonCard pokemon={item} />}
        onEndReachedThreshold={0.6}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{height: 120}} />}
      />
    </View>
  );
};
