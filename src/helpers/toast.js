import Toast from 'react-native-root-toast';
export function showToast(message, time){

    // Add a Toast on screen.
let toast = Toast.show(message, {
    duration: time== 'long' ? Toast.durations.LONG : Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
});
}
