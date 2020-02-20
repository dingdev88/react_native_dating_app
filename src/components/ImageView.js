import React from 'react';
import { View } from 'react-native';
import { colors } from '../styles';
import { api } from '../config'
import FastImage from 'react-native-fast-image';
import { PolyfillXMLHttpRequest } from 'rn-fetch-blob';
import SvgUri from 'react-native-svg-uri';

export default class ImageView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            imageType: 'png'
        }
    }
    getFastImageResizeMode = (resizeMode) =>{
        switch(resizeMode) {
            case 'contain':
                return FastImage.resizeMode.contain;
            case 'cover':
                return FastImage.resizeMode.cover;
            case 'stretch':
                return FastImage.resizeMode.stretch;
            case 'center':
                return FastImage.resizeMode.center;
            default:
                return FastImage.resizeMode.contain;
        }
            
    }
    onLoad(success){
        console.log("onLoad", success)
        this.setState({loaded: success})
    }

    getRemoteImageWithPlaceholder = (props, placeholder, src) => {
        return <View>
                {
                    !this.state.loaded &&
                    <FastImage 
                            source={placeholder}
                            style={props.style}
                    />
                }
                <FastImage 
                    source={src}
                    style={this.state.loaded? props.style: {width:0, height:0}}
                    onLoad={()=> {
                        this.onLoad(true);
                    }}
                    onError={()=>{
                        this.onLoad(false);
                    }}
                    resizeMode={this.getFastImageResizeMode(props.resizeMode)}
                    resizeMethod={'stretch'}
                    
                />
            </View>
        
    }

    getImage = (props, src) =>{
        if(src && src.uri && src.uri.endsWith('.svg')) {
            return <SvgUri
                style={props.style}
                source={src}
                width={props.width}
                height={props.height}
                />
        

         
        } else {
            return <FastImage 
                source={src}
                style={props.style}
                resizeMode={this.getFastImageResizeMode(props.resizeMode)}
            />
        }


    }
    render() {
        const { source, defaultImage, shortUrl } = this.props;
 
        var src = {};
        if(shortUrl) {
            src.uri = api.base + '/'+ shortUrl;
        } else {
            src = source ? source : defaultImage;
        }
        var isRemote= false;
       if(src && src.uri  && src.uri.startsWith('http')) {
           isRemote = true;
       }
    
        
        return (
            <View style={[this.props.style, {alignItems:'center', justifyContent:'center'}]}>
                {
                    (isRemote && defaultImage) ?
                    this.getRemoteImageWithPlaceholder(this.props, defaultImage, src)
                    :
                    this.getImage(this.props, src)
                }
            </View>
  
            
        );

    }
}