import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Colors } from '../assets/Colors';
import { NavBarStyle } from '../assets/Styles';
import IconComponent from './IconComponent';

export default class IconNavbarComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            onPress: props.onPress,
            icon: props.icon
        }
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps != this.props) {
            this.setState({
                onPress: nextProps.onPress,
                icon: nextProps.icon
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
        return (
            <TouchableWithoutFeedback style={NavBarStyle.leftIcon} onPress={this.state.onPress}>
                <IconComponent src={this.state.icon} color={Colors.white} />
            </TouchableWithoutFeedback>
        );
    }
}