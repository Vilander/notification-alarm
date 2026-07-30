import * as Notifications from "expo-notifications"

Notifications.setNotificationHandler({
  handleNotification: async() => ({
    shouldPlaySound: true,
    shouldShowList:true,
    shouldShowBanner: true,
    shouldSetBadge: false,
  })
})

export async function requestPermissaoNotificacao() {
  const { status } = await Notifications.requestPermissionsAsync()

  return status === "granted";
}

//Notificações Imediatas
export async function envioImediatoNotificacao() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📢 Mensagem Imediata 📢",
      body: "Essa mensagem é imediata"
    },
    trigger: null
  })
}

//Notificações 5 segundos
export async function envioDelayNotificacao() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏲️ Notificação atrasada ⏲️",
      body: "Passaram 5 segundos"
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      //repeats: true
    }
  })
}

export async function cancelarTodasNotificacoes() {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

//Notificações com som
export async function envioSomNotificacao() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🎧 Lembrete 🎧",
      body: "Essa mensagem é com som",
      sound: "default"
    },
    trigger: null
  })
}

export async function agendarAlarme(hora: string, minuto: string) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Agenda a nova notificação
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ Alarme Disparado! ⏰",
      body: `Esse é o alarme das ${hora}:${minuto}.`, // Sua mensagem customizada
      sound: "default",
    },
    trigger: {
      hour: parseInt(hora, 10),     
      minute: parseInt(minuto, 10), 
      repeats: true,
    },
  });
}