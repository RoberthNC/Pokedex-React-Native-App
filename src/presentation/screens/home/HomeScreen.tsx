import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {FlatList, StyleSheet, View} from 'react-native';
import {getPokemons} from '../../../actions/pokemons';
import {PokeballBg} from '../../components/ui/PokeballBg';
import {FAB, Text, useTheme} from 'react-native-paper';
import {globalTheme} from '../../../config/theme/global-theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PokemonCard} from '../../components/pokemons/PokemonCard';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigator/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'Home'> {}

export const HomeScreen = ({navigation}: Props) => {
  const {top} = useSafeAreaInsets();
  const theme = useTheme();
  // Traditional request
  // const {isLoading, data: pokemons = []} = useQuery({
  //   queryKey: ['pokemons'],
  //   queryFn: () => getPokemons(0),
  //   staleTime: 1000 * 60 * 60,
  // });

  const {isLoading, data, fetchNextPage} = useInfiniteQuery({
    queryKey: ['pokemons', 'infinite'],
    initialPageParam: 0,
    queryFn: params => getPokemons(params.pageParam),
    getNextPageParam: (lastPage, pages) => pages.length,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <View style={globalTheme.globalMargin}>
      <PokeballBg style={styles.imgPosition} />
      <FlatList
        style={{paddingTop: top + 20}}
        numColumns={2}
        ListHeaderComponent={() => <Text variant="displayMedium">Pokedex</Text>}
        data={data?.pages.flat() ?? []}
        keyExtractor={(item, index) =>
          item.id.toString().concat((index + 1).toString())
        }
        renderItem={({item}) => <PokemonCard pokemon={item} />}
        onEndReachedThreshold={0.6}
        onEndReached={() => fetchNextPage()}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        label="Search"
        style={[globalTheme.fab, {backgroundColor: theme.colors.primary}]}
        mode="elevated"
        onPress={() => navigation.push('SearchScreen')}
        color={theme.dark ? 'black' : 'white'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imgPosition: {
    position: 'absolute',
    top: -100,
    right: -100,
  },
});
