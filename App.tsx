import { StyleSheet, View, Text, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '@/components/Button';
import HoraAtual from '@/components/HoraAtual';
import RelogioInput from '@/components/RelogioInput';
import { agendarAlarme, requestPermissaoNotificacao } from '@/services/notifications';

export default function App() {
  const [minutoDigitado, setMinutoDigitado] = useState('');
  const [horaDigitada, setHoraDigitada] = useState('');
  const [horaReal, setHoraReal] = useState('');
  const [alarmeSalvo, setAlarmeSalvo] = useState<string | null>(null);

useEffect(() => {
    async function iniciarApp() {
      await requestPermissaoNotificacao();
      
      const horarioSalvo = await AsyncStorage.getItem('@alarme_registrado');
      if (horarioSalvo) {
        setAlarmeSalvo(horarioSalvo);
      }
    }
    iniciarApp();
  }, []);
  
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

const handleDefinirAlarme = async () => {
    if (!horaDigitada || !minutoDigitado) {
      Alert.alert("Atenção", "Preencha a hora e o minuto.");
      return;
    }

    const horarioFormatado = `${horaDigitada}:${minutoDigitado}`;

    try {
      await agendarAlarme(horaDigitada, minutoDigitado);
      
      await AsyncStorage.setItem('@alarme_registrado', horarioFormatado);
      
      setAlarmeSalvo(horarioFormatado);
      Alert.alert("Sucesso", `Alarme definido para ${horarioFormatado}.`);
      
      setHoraDigitada('');
      setMinutoDigitado('');
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o alarme.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> ⏱️ ClockBox ⏱️ </Text>
      <HoraAtual time={horaReal} />

      {alarmeSalvo && (
        <Text style={styles.salvoTexto}>Alarme Registrado: {alarmeSalvo}</Text>
      )}

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
          onPress={handleDefinirAlarme}
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
    paddingBottom: 40,
    color: '#929292'
  },
  salvoTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cc0000',
    paddingBottom: 10
  }
})