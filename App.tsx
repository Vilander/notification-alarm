import { StyleSheet, View, Text, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';

import Button from '@/components/Button';
import HoraAtual from '@/components/HoraAtual';
import RelogioInput from '@/components/RelogioInput';

export default function App() {
  const [minutoDigitado, setMinutoDigitado] = useState('');
  const [horaDigitada, setHoraDigitada] = useState('');
  
  const [horaReal, setHoraReal] = useState('');

  useEffect(() => {
    const atualizarRelogio = () => {
      const agora = new Date();
      const formatador = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false 
      });
      setHoraReal(formatador.format(agora));
    };

    atualizarRelogio(); 
    const intervalo = setInterval(atualizarRelogio, 1000); 

    return () => clearInterval(intervalo);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> ⏱️ ClockBox ⏱️ </Text>
      <HoraAtual time={horaReal} />
      <View style={styles.alarmArea}>
        <Text style={styles.boxInput}>Para qual horario você quer seu alarme?</Text>
        <RelogioInput 
          hour={horaDigitada} 
          minute={minutoDigitado} 
          onChangeHour={setHoraDigitada} 
          onChangeMinute={setMinutoDigitado} 
        />
        
        <Button 
          title="Definir Alarme" 
          onPress={() => Alert.alert("Sucesso", `Você escolheu: ${horaDigitada}:${minutoDigitado}`)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 20
  },
  alarmArea: {
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    gap: 15,
    padding: 20, 
    borderColor: '#7a7a7a',
    borderWidth: 2,
    borderRadius: 18, 
    backgroundColor: '#f9f9f9'
  },
  boxInput:{
    fontWeight: '300',
  },
  title:{
    fontSize: 32,
    fontWeight: '700',
    paddingBottom: 100,
    color: '#929292'
  }
})