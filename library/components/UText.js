import React from 'react'
import { Text } from 'react-native'

const DEFAULT_TEXT_PROPS = {
    maxFontSizeMultiplier: 1.5,
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8
}
export const UText = (props, ref) => {
    const mergedProps = {
        ...DEFAULT_TEXT_PROPS,
        ...props
    }

    return(
        <Text { ...ref } { ...mergedProps }>
            { props.children }
        </Text>
    )
}

export default UText