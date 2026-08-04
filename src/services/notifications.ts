import * as Notifications from "expo-notifications"
import { Platform } from "react-native"

Notifications.setNotificationHandler({
  handleNotification: async() => ({
    shouldPlaySound: true,
    shouldShowList:true,
    shouldShowBanner: true,
    shouldSetBadge: false,
  })
})

export async function requestPermissaoNotificacao() {

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Alarme',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync()

  return status === "granted";
}

export async function cancelarTodasNotificacoes() {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

export async function agendarAlarme(hora: string, minuto: string) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const dataAlarme = new Date();
  
  dataAlarme.setHours(parseInt(hora, 10));
  dataAlarme.setMinutes(parseInt(minuto, 10));
  dataAlarme.setSeconds(0);
  dataAlarme.setMilliseconds(0);

  if (dataAlarme.getTime() < Date.now()) {
    dataAlarme.setDate(dataAlarme.getDate() + 1);
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ Alarme Disparado! ⏰",
      body: `Esse é o alarme das ${hora}:${minuto}.`, 
      sound: true, 
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dataAlarme, 
    },
  });
}