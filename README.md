# Notification Alarm

Aplicativo mobile em React Native + Expo para definir um alarme por horário e receber uma notificação local quando o horário for alcançado.

## Visão geral

Este projeto é uma solução simples e direta para:

- mostrar a hora atual do sistema em fuso horário de São Paulo;
- permitir que o usuário informe hora e minuto do alarme;
- salvar o alarme no armazenamento local;
- agendar uma notificação local com o Expo Notifications;
- exibir o alarme salvo na tela.

O app foi construído como uma demonstração de uso prático de `expo-notifications`, `AsyncStorage` e componentização em React Native.

---

## Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- AsyncStorage
- Expo Notifications

---

## Estrutura do projeto

```bash
notification-alarm/
├── App.tsx
├── app.json
├── index.ts
├── package.json
├── tsconfig.json
├── assets/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   └── index.tsx
│   │   ├── HoraAtual/
│   │   │   └── index.tsx
│   │   └── RelogioInput/
│   │       └── index.tsx
│   └── services/
│       └── notifications.ts
└── README.md
```

---

## Como iniciar um projeto igual do zero

### 1) Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js LTS
- npm ou yarn
- Git
- Expo Go no celular ou Android Studio / Xcode para emuladores

Verifique:

```bash
node -v
npm -v
```

### 2) Criar o projeto Expo

No terminal, rode:

```bash
npx create-expo-app notification-alarm --template blank-typescript
cd notification-alarm
```

### 3) Instalar dependências do projeto

Esse projeto usa armazenamento local e notificações:

```bash
npm install @react-native-async-storage/async-storage expo-notifications
```

Se quiser confirmar todas as dependências, pode verificar o `package.json` do projeto atual.

### 4) Configurar o caminho de alias `@`

Este projeto usa a configuração:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

No arquivo `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Isso permite importar módulos assim:

```ts
import Button from '@/components/Button';
```

### 5) Iniciar o projeto

Para rodar a aplicação:

```bash
npm start
```

Ou diretamente:

```bash
npx expo start
```

Depois, escolha uma opção:

- `a` para Android
- `i` para iOS
- `w` para web

Se estiver usando o celular, abra o Expo Go e escaneie o QR code.

---

## Como rodar este projeto no ambiente atual

Na raiz do projeto:

```bash
npm install
npm start
```

Se o projeto já estiver montado e as dependências estiverem instaladas, basta usar:

```bash
npx expo start
```

---

## Fluxo de uso da aplicação

### Tela principal

A tela principal é renderizada em `App.tsx` e contém:

- título do app;
- relógio local em tempo real;
- campo para inserir a hora do alarme;
- campo para inserir os minutos;
- botão para registrar o alarme;
- exibição do alarme já salvo.

### Fluxo da lógica

1. O app carrega e solicita permissão para notificações.
2. Busca no `AsyncStorage` se existe um alarme previamente salvo.
3. Atualiza a hora atual a cada segundo.
4. O usuário digita hora e minuto.
5. Ao pressionar o botão, o sistema valida os dados.
6. O alarme é agendado com `expo-notifications`.
7. O horário é salvo em local storage para persistência.
8. Quando chega o horário, a notificação local dispara.

---

## Principais funções e lógicas do código

### 1) `App.tsx`

Arquivo principal da aplicação.

#### Estados principais

```ts
const [minutoDigitado, setMinutoDigitado] = useState('');
const [horaDigitada, setHoraDigitada] = useState('');
const [horaReal, setHoraReal] = useState('');
const [alarmeSalvo, setAlarmeSalvo] = useState<string | null>(null);
```

Esses estados controlam:

- hora informada pelo usuário;
- minuto informado pelo usuário;
- hora atual da aplicação;
- alarme salvo no armazenamento local.

#### Efeito de inicialização

```ts
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
```

Lógica:

- solicita permissão de notificação;
- consulta se já existe um alarme salvo;
- se existir, mostra na tela.

#### Relógio em tempo real

```ts
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
```

Essa parte:

- busca o horário atual;
- usa o fuso de São Paulo;
- atualiza a cada segundo.

#### Definição do alarme

```ts
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
```

Lógica:

- valida se hora e minuto foram preenchidos;
- monta a string do horário;
- agenda a notificação;
- salva no AsyncStorage;
- atualiza estado visual;
- limpa os inputs.

#### Botão desabilitado

```ts
const isBotaoBloqueado = !horaDigitada || !minutoDigitado;
```

O botão fica desativado até ambos os campos estarem preenchidos.

---

### 2) `src/services/notifications.ts`

Arquivo responsável por todas as ações relacionadas a notificações.

#### Configuração do handler

```ts
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowList: true,
    shouldShowBanner: true,
    shouldSetBadge: false,
  })
})
```

Esse bloco define o comportamento padrão da notificação:

- tocar som;
- exibir na lista de notificações;
- mostrar banner;
- não alterar badge.

#### Permissão de notificação

```ts
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
```

Esse trecho:

- cria um canal de notificação no Android;
- exige autorização do usuário;
- retorna se a permissão foi concedida.

#### Ajuste do horário do alarme

```ts
const dataAlarme = new Date();

dataAlarme.setHours(parseInt(hora, 10));
dataAlarme.setMinutes(parseInt(minuto, 10));
dataAlarme.setSeconds(0);
dataAlarme.setMilliseconds(0);

if (dataAlarme.getTime() < Date.now()) {
  dataAlarme.setDate(dataAlarme.getDate() + 1);
}
```

A lógica é:

- transforma a hora/minuto em números;
- define o horário do alarme;
- se o horário já passou no dia atual, agenda para o próximo dia.

#### Agendamento da notificação

```ts
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
```

Isso cria uma notificação agendada em uma data exata.

#### Cancelar notificações anteriores

```ts
await Notifications.cancelAllScheduledNotificationsAsync();
```

Antes de criar um novo alarme, todas as notificações agendadas são removidas para evitar múltiplos alarmes ativos ao mesmo tempo.

---

### 3) `src/components/RelogioInput/index.tsx`

Componente responsável por capturar a hora e o minuto.

Ele usa dois `TextInput` com máscara simples:

```tsx
<TextInput
  style={styles.input}
  keyboardType="numeric"
  maxLength={2}
  value={hour}
  onChangeText={onChangeHour}
  placeholder="00"
/>
```

Esse componente recebe:

- `hour`;
- `minute`;
- `onChangeHour`;
- `onChangeMinute`.

Sua função principal é separar a entrada da hora e do minuto em campos independentes.

---

### 4) `src/components/HoraAtual/index.tsx`

Componente de apresentação da hora atual:

```tsx
export default function HoraAtual({ time }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HORA ATUAL:</Text>
      <Text style={styles.text}>{time}</Text>
    </View>
  )
}
```

Ele apenas recebe uma string e exibe na tela.

---

### 5) `src/components/Button/index.tsx`

Componente reutilizável para o botão principal do app.

```tsx
type Props = TouchableOpacityProps & {
  title: string;
}
```

Comportamento:

- recebe o texto do botão;
- aceita qualquer propriedade do `TouchableOpacity`;
- aplica estilo quando `disabled` for verdadeiro;
- exibe `Text` dentro do botão.

---

## Persistência com AsyncStorage

O alarme salvo é armazenado com a chave:

```ts
'@alarme_registrado'
```

Exemplo:

```ts
await AsyncStorage.setItem('@alarme_registrado', '08:30');
```

Isso permite que o usuário volte ao app e veja o alarme previamente configurado.

---

## Observações importantes

### Permissões de notificação

Em dispositivos Android, é necessário que a permissão de notificação seja concedida para que a aplicação consiga disparar alertas.

### Notificações locais

Este app usa notificações locais, não push notifications do backend. Ou seja, o alarme funciona mesmo sem servidor.

### Fuso horário

O relógio usa:

```ts
timeZone: 'America/Sao_Paulo'
```

Isso faz com que o horário exibido e o agendamento sigam o horário de Brasília.

### Próximo dia

Se o usuário definir um horário que já passou no dia atual, o app agenda para o dia seguinte. Isso evita que o alarme seja disparado imediatamente.

---

## Possíveis melhorias futuras

- permitir remover o alarme salvo;
- permitir editar um alarme existente;
- adicionar sons personalizados;
- criar uma interface mais moderna com picker de hora;
- salvar múltiplos alarmes;
- notificação com vibração e ações;
- testar em Android e iOS com mais cenários de permissão.

---

## Resumo rápido

Este app funciona como um despertador simples baseado em notificações locais:

- coleta hora e minuto;
- salva no armazenamento;
- agenda notificação;
- dispara alertas no horário certo.

A lógica central está em `App.tsx` e `src/services/notifications.ts`, com os componentes reutilizáveis cuidando da interface.

---

## Comandos úteis

```bash
npm install
npm start
npx expo start --android
npx expo start --ios
```

---

## Licença

Este projeto foi desenvolvido como exemplo de uso do Expo Notifications em React Native.
