//snipet: rnfs - > react native function and style
import { StyleSheet, 
    Text,
    TouchableOpacity, 
    TouchableOpacityProps
} from 'react-native'
import React from 'react'

type Props = TouchableOpacityProps & {
    title:string;
}

export default function Button({title, disabled,...rest}:Props) {
  return (
    <TouchableOpacity 
      style={[styles.container, disabled && styles.containerDisabled]}
      activeOpacity={0.8}
      disabled={disabled}
      {...rest}
      >
      <Text style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#045f1f', 
    height: 48,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  containerDisabled: {
    backgroundColor: '#7bb08c', 
    opacity: 0.6,
  },
  text:{
    fontSize: 22,
    color: '#f2f2f2'
  }
})