import React from 'react';
import { Platform, StyleSheet, View, Image } from 'react-native';

export default class IconComponent extends React.Component {
  aceitarAtualizacao = true;

  constructor(props) {
    super(props);
    this.state = {
      source: props.src,
      receivedStyle: props.style,
      size: props.size != null ? props.size : 25,
      tintColor: props.color != null ? props.color : "#000"
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps != this.props) {
      this.setState({
        source: nextProps.src,
        receivedStyle: nextProps.style,
        size: nextProps.size != null ? nextProps.size : 25,
        tintColor: nextProps.color != null ? nextProps.color : "#000"
      })
      this.aceitarAtualizacao = true;
      return false;
    }
    if (this.aceitarAtualizacao) {
      this.aceitarAtualizacao = false;
      return true;
    } else {
      return false;
    }
  }


  render() {
    //console.log('IconeComponent.state: ',this.state);
    let imageElement;
    let tintColor = this.state['tintColor'];
    if (tintColor == null || tintColor == '') {
      tintColor = '#000000';
    }

    if (Platform.OS === 'ios') {
      return (<View><Image
        source={this.state['source']}
        style={[styles.icone, this.state['receivedStyle'], { height: this.state['size'], tintColor: tintColor }]}
      /></View>)
    } else {
      return (<View><Image
        source={this.state['source']}
        style={[styles.icone, this.state['receivedStyle'], { height: this.state['size'] }]}
        tintColor={tintColor}
      /></View>)
    }
    
  }

}

const styles = StyleSheet.create({
  icone: {
    height: '60%',
    aspectRatio: 1
  }
})