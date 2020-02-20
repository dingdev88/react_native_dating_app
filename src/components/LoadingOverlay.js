import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

class LoadingOverlay extends Component {
  
  render = () => {
    const { visible } = this.props;
    if(!visible) 
        return null;
    return (
      <View style={styles.background}>
        <ActivityIndicator animating={true} size="large" color="#fff" />
      </View>

    );
  };
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems:'center'
  },
});

const mapStateToProps = (state) => {
  const { app } = state;

  return { app };
};

export default LoadingOverlay;
