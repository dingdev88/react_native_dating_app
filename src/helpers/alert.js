import {Alert} from 'react-native';
export function showAlert(title, message){
    setTimeout(()=> {
        Alert.alert(title, message);
    }, 200)
}

export function showAlertWithCallback(title, message, cb) {
    setTimeout(()=> {
        Alert.alert(title, message, [{text: 'OK', onPress:cb}]);
    }, 200)
}
export function showAlertWithQuestionCallback(title, message, cb) {
    setTimeout(()=> {
        Alert.alert(title, message, [{text: 'YES', onPress:cb},{text: 'NO'}]);
    }, 200)
}

export function confirmAlertWithCallback(title, message, cb) {
    setTimeout(()=> {
        Alert.alert(title, message, [{text: 'OK', onPress:cb}, {text: 'Cancel', onPress: () => false, style: 'cancel'}]);
    }, 200)
}