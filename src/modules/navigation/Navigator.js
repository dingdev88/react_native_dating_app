import React from 'react';
import { connect } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import ModalNavigator from './ModalNavigator';

class NavigatorView extends React.Component {

  render () {
    const { auth } = this.props;
    if(auth.user && auth.token)
      return <ModalNavigator />
    else
      return <AuthNavigator />
  } 
}

const mapStateToProps = (state) => ({ app: state.app, auth: state.auth });

export default connect(mapStateToProps)(NavigatorView);