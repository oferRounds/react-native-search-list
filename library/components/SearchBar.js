/**
 * Created by haywoodfu on 17/4/16.
 */

import {
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet
} from 'react-native'
import React, { Component } from 'react'

import PropTypes from 'prop-types'
import Theme from './Theme'
import UText from './UText'


const {cancelButtonWidth: buttonWidth, searchBarHorizontalPadding, searchIconWidth} = Theme.size

export default class SearchBar extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func, // search input value changed callback,

    onFocus: PropTypes.func, // search input focused callback
    onBlur: PropTypes.func, // search input blured callback

    onClickCancel: PropTypes.func, // the search cancel button clicked
    cancelTitle: PropTypes.string, // title for the search cancel button
    cancelTextColor: PropTypes.string, // color for the search cancel button

    searchInputBackgroundColor: PropTypes.string, // default state background color for the search input
    searchInputBackgroundColorActive: PropTypes.string, // active state background color for the search input
    searchInputPlaceholderColor: PropTypes.string, // default placeholder color for the search input
    searchInputTextColor: PropTypes.string, // default state text color for the search input
    searchInputTextColorActive: PropTypes.string, // active state text color for the search input
    searchInputBorderColor: PropTypes.string,

    searchBarBackgroundColor: PropTypes.string, // active state background color for the search bar

    isShowHolder: PropTypes.bool, // 是否显示搜索图标
    searchInputEnabled: PropTypes.bool
  }

  static defaultProps = {
    searchInputBackgroundColor: '#FFF',
    searchInputBackgroundColorActive: '#171a23',

    searchInputPlaceholderColor: '#979797',
    searchInputBorderColor: 'red',
    searchInputTextColor: '#171a23',
    searchInputTextColorActive: '#FFF',
    searchInputEnabled: true,

    searchBarBackgroundColor: '#171a23',

    cancelTextColor: 'white',
    cancelTitle: 'Cancel'
  }

  constructor (props) {
    super(props)
    this.state = {
      value: props.value,
      isShowHolder: true,
      animatedValue: new Animated.Value(0)
    }
  }

  onChange (str) {
    this.props.onChange && this.props.onChange(str)
    this.setState({str})
  }

  onBlur () {
    this.props.onBlur && this.props.onBlur()
  }

  onFocus () {
    this.props.onFocus && this.props.onFocus()
    this.searchingAnimation(true)
  }

  searchingAnimation (isSearching) {
    let toVal = 0

    if (isSearching) {
      this.state.animatedValue.setValue(0)
      toVal = buttonWidth
    } else {
      this.state.animatedValue.setValue(buttonWidth)
      toVal = 0
    }

    Animated.timing(this.state.animatedValue, {
      duration: Theme.duration.toggleSearchBar,
      toValue: toVal
    }).start(() => {
      this.setState({isShowHolder: !isSearching})
    })
  }

  cancelSearch () {
    this.refs.input.clear()
    this.refs.input.blur()
    this.searchingAnimation(false)
    this.props.onClickCancel && this.props.onClickCancel()
  }

  render () {
    return (
      <View
        style={[
          this.props.style,
          {
            flexDirection: 'row',
            padding: searchBarHorizontalPadding,
            paddingTop: 0,
            height: Theme.size.searchInputHeight,
            backgroundColor: this.props.searchBarBackgroundColor
          },
          {
            width: Theme.size.windowWidth + buttonWidth
          }
        ]}>
        <Animated.View style={{
          width: this.state.animatedValue.interpolate({
            inputRange: [0, buttonWidth],
            // TODO 这里要想办法做得更灵活一点
            outputRange: [Theme.size.windowWidth - searchBarHorizontalPadding * 2, Theme.size.windowWidth - buttonWidth - searchBarHorizontalPadding]
          }),
          backgroundColor: this.state.animatedValue.interpolate({
            inputRange: [0, buttonWidth],
            outputRange: [this.props.searchInputBackgroundColor, this.props.searchInputBackgroundColorActive]
          }),
          height: 46,
          borderRadius: 4
        }}>
          <TextInput
            editable = { this.props.searchInputEnabled}
            onFocus={this.onFocus.bind(this)}
            onBlur={this.onBlur.bind(this)}
            allowFontScaling={false}
            ref='input'
            style={[styles.searchTextInputStyle, {
              color: this.props.searchInputTextColorActive && ! this.state.isShowHolder
                ? this.props.searchInputTextColorActive
                : this.props.searchInputTextColor || '#979797'
            }, this.props.searchTextInputStyle,
              { borderColor: this.props.searchInputBorderColor }
            ]}
            onChangeText={this.onChange.bind(this)}
            value={this.state.value}
            underlineColorAndroid='transparent'
          />

          <Animated.View
            pointerEvents='none'
            style={[
              styles.leftSearchIconStyle,
              {
                opacity: this.state.animatedValue.interpolate({
                  inputRange: [0, buttonWidth],
                  outputRange: [0, 1]
                })
              }
            ]}>
            <Image
              style={styles.searchIconStyle}
              source={require('../images/icon-search.png')} />
          </Animated.View>

          <Animated.View
            pointerEvents='none'
            style={[styles.centerSearchIconStyle, {
              opacity: this.state.animatedValue.interpolate({
                inputRange: [0, 70],
                outputRange: [!this.state.value ? 1 : 0, 0]
              })
            }]}>
            <Image
              style={styles.searchIconStyle}
              source={require('../../../../../images/search_icon.png')} />
            <UText style={{
              marginLeft: 5,
              marginTop: 1,
              color: this.props.searchInputPlaceholderColor,
              fontFamily: 'Gotham-Book',
              fontSize: 14,
              backgroundColor: 'rgba(0, 0, 0, 0)'
            }}>{this.props.placeholder}</UText>
          </Animated.View>
        </Animated.View>
        <View style={{
          width: buttonWidth,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TouchableWithoutFeedback onPress={this.cancelSearch.bind(this)}>
            <View
              style={{
                flex: 1,
                height: Theme.size.searchInputHeight,
                marginLeft: this.state.isShowHolder ? 15 : 0,
                width: buttonWidth,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5
              }}
              shouldRasterizeIOS
              renderToHardwareTextureAndroid
            >
              <UText
                allowFontScaling={false}
                style={{color: this.props.cancelTextColor, fontFamily: 'Gotham-Book', fontSize: 14 }}
                numberOfLines={1}>{this.props.cancelTitle}</UText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  };
}

const styles = StyleSheet.create({
  searchTextInputStyle: {
    flex: 1,
    height: 46,
    padding: 0,
    paddingLeft: searchIconWidth,
    paddingRight: 8,
    borderRadius: 5,
    borderWidth: 1
  },
  centerSearchIconStyle: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    top: 2,
    left: 12,
    right: 0,
    bottom: 0,
    alignSelf: 'stretch'
  },
  leftSearchIconStyle: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    width: searchIconWidth
  },
  searchIconStyle: {
    width: 18,
    height: 18
  }
})
