/**
 * Created by erichua on 24/02/2018.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UText from './UText'

export default class HighlightableText extends Component {
  static propTypes = {
    matcher: PropTypes.object,
    text: PropTypes.string.isRequired,
    textColor: PropTypes.string,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.number,
    hightlightTextColor: PropTypes.string
  }

  static defaultProps = {
    fontFamily: 'Open Sans',
    fontSize: 15,
    textColor: '#171a23',
    hightlightTextColor: '#dcb35f'
  }


  render () {
    const {textColor, hightlightTextColor, fontSize, fontFamily} = this.props
    let startIndex = 0
    let titleContents = []

    const key = 'key'
    const {text = '', matcher: {matches = []} = {}} = this.props

    for (let match of matches) {
      if (match && match.start > startIndex) {
        let endIndex = match.end > text.length ? text.length : match.end
        // 当前位置和匹配起始位置之间的文字
        let str = text.slice(startIndex, match.start)
        titleContents.push(<UText key={key + startIndex} style={{
          fontFamily: fontFamily,
          fontSize: fontSize,
          color: textColor
        }}>{str}</UText>)

        // 被选中的文字
        let selStr = text.slice(match.start, endIndex)
        titleContents.push(<UText key={key + match.start} style={{
          fontFamily: fontFamily,
          fontSize: fontSize,
          color: hightlightTextColor
        }}>{selStr}</UText>)

        startIndex = endIndex
      } else if (match) {
        let endIndex = match.end > text.length ? text.length : match.end
        // 被选中的文字
        let selStr = text.slice(startIndex, endIndex)
        titleContents.push(<UText key={key + startIndex} style={{
          fontFamily: fontFamily,
          fontSize: fontSize,
          color: hightlightTextColor
        }}>{selStr}</UText>)

        startIndex = endIndex
      }
    }
    // 剩余的文字
    if (startIndex < text.length) {
      let str = text.slice(startIndex, text.length)
      titleContents.push(<UText key={key + startIndex} style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        color: textColor
      }} numberOfLines={1}>{str}</UText>)
    }

    return (
      <UText style={{flexDirection: 'row'}}>
        {titleContents}
      </UText>
    )
  }
}