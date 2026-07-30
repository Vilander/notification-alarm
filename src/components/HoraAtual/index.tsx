import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {
  time: string;
}

export default function HoraAtual({ time }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HORA ATUAL:</Text>
      <Text style={styles.text}>{time}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems:'center',
    borderColor: '#cc0000',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title:{
    fontSize: 14,
    fontWeight: 400,
    color: '#ccc',
  },
  text: {
    color: '#cc0000',
    fontSize: 32,
    fontWeight: '500',
  }
})