/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';	

const customTextProps = {
    style: {	  
        fontFamily: 'Proxima Nova Alt'
    }
};
setCustomTextInput(customTextProps)
setCustomText(customTextProps);

AppRegistry.registerComponent(appName, () => App);
