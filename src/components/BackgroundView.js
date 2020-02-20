import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import ImageView from './ImageView';

class BackgroundView extends Component {
  render = () => {
    return (
        <ImageView
          style={styles.background}
          source={this.props.source}
          defaultImage={require('../../assets/images/splash.png')}
          resizeMode='cover'
        />

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
  },
});

const mapStateToProps = (state) => {
  const { app } = state;

  return { app };
};

export default connect(mapStateToProps)(BackgroundView);
