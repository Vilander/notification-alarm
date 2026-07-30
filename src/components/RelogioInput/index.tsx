import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'

type Props = {
  hour: string;
  minute: string;
  onChangeHour: (text: string) => void;
  onChangeMinute: (text: string) => void;
}

export default function RelogioInput({ hour, minute, onChangeHour, onChangeMinute }: Props) {
  return (
    <View style={styles.square}>
      <TextInput
        style={styles.input}
        keyboardType="numeric" 
        maxLength={2}          
        value={hour}
        onChangeText={onChangeHour}
        placeholder="00"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.colon}>:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={2}
        value={minute}
        onChangeText={onChangeMinute}
        placeholder="00"
        placeholderTextColor="#aaa"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  square: {
    width: '100%',
    height: 90,
    borderWidth: 2,
    borderColor: '#7a7a7a',
    borderRadius: 8, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  input: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    width: 55, 
  },
  colon: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 5, 
  }
})