/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  Linking,
  Button,
} from 'react-native';
import { Header, Colors } from 'react-native/Libraries/NewAppScreen';

import BackgroundJob from 'react-native-background-actions';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

BackgroundJob.on('expiration', () => {
  console.log('iOS: I am being closed!');
});

const taskRandom = async (taskData) => {
  if (Platform.OS === 'ios') {
    console.warn(
      'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
      'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.'
    );
  }
  await new Promise(async (resolve) => {
    // For loop with a delay
    const { delay } = taskData;
    console.log(BackgroundJob.isRunning(), delay)
    for (let i = 0; BackgroundJob.isRunning(); i++) {
      console.log('Runned -> ', i);
      await BackgroundJob.updateNotification({ taskDesc: 'Runned -> ' + i });
      await sleep(delay);
    }
  });
};

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask desc',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  parameters: {
    delay: 1000,
  },
};

// function handleOpenURL(evt) {
//   console.log(evt.url);
//   // do something with the url
// }

// Linking.addEventListener('url', handleOpenURL);

const App = () => {
  const initialState = BackgroundJob.isRunning();
  const [playing, setPlaying] = useState(initialState);

  const toggleBackground = async () => {
    if (!playing) {
      try {
        console.log('Trying to start background service');
        await BackgroundJob.start(taskRandom, options);
        console.log('Successfully started!');
        setPlaying(true);
      } catch (e) {
        console.log('Error', e);
      }
    }
    else {
      console.log('Stop background service');
      await BackgroundJob.stop();
      setPlaying(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Button
          title = "Start / Stop Background Task"
          onPress = {toggleBackground}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  }
});

export default App;