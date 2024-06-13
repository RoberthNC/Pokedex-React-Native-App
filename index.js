/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import {PokedexApp} from './src/PokedexApp';
import {name as appName} from './app.json';

LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => PokedexApp);
