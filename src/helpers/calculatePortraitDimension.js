import { 
    Dimensions
} from 'react-native';
export default function calculatePortraitDimension() {
    var {
        width: deviceWidth,
        height: deviceHeight
      } = Dimensions.get('window');

    var portraitWidth = deviceWidth < deviceHeight ? deviceWidth : deviceHeight;
    var portraitHeight = deviceWidth < deviceHeight ? deviceHeight: deviceWidth;
    return { width: portraitWidth, height: portraitHeight};
    
}