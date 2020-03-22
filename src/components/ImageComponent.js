import React from 'react';
import { Platform, StyleSheet, View, Image } from 'react-native';
import { Images } from '../../../assets/Images';
import IconeComponent from './IconeComponent';
import { Colors } from '../../../assets/Colors';

export default class ImageComponent extends React.Component {
  aceitarAtualizacao = true;

  constructor(props) {
    super(props);
    this.state = {
      receivedProps: props
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps != this.props) {
      this.setState({
        receivedProps: props
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
    //console.log('IconeComponent.state: ',this.state)
    let p = this.state.receivedProps;
    if(p.source == null || p.source == "" || p.source.uri == null || p.source.uri == ""){
        return(
            <View style={p.style}>
                <View style={styles.centerIcone}>
                    <IconeComponent 
                    src={Images.baseline_broken_image_white_48pt} 
                    style={styles.icone} 
                    size={36}
                    color={Colors.grey_dark}/>
                </View>
            </View>
        );
    }
    return(
        <Image source={p.source} style={p.style}/>
    );
  }

}

const styles = StyleSheet.create({
  icone: {
    height: '40%',
    aspectRatio: 1,
    alignSelf: 'center'
  },
  centerIcone: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignContent: 'center'
  }
})