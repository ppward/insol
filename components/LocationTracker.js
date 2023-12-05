import React, {useEffect, useState} from 'react';
import {AppState} from 'react-native';
import BackgroundGeolocation from '@transistorsoft/react-native-background-geolocation';

const LocationTracker = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    // Configure the library with your desired settings
    BackgroundGeolocation.ready(
      {
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        stopOnTerminate: false, // Continue tracking after app termination
        startOnBoot: true, // Start tracking after device reboot
        debug: true, // Debug sounds & notifications
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        // Add more configuration options as needed
      },
      state => {
        console.log(
          '- BackgroundGeolocation is configured and ready: ',
          state.enabled,
        );

        if (!state.enabled) {
          // Start tracking location
          BackgroundGeolocation.start(() => {
            console.log('- Start success');
          });
        }
      },
    );

    // Location update listener
    BackgroundGeolocation.onLocation(
      location => {
        console.log('[location] - ', location);
      },
      error => {
        console.warn('[location] ERROR - ', error);
      },
    );

    // Handle activity change events (e.g., still, on_foot, in_vehicle)
    BackgroundGeolocation.onActivityChange(activityEvent => {
      console.log('[activityChange] - ', activityEvent);
    });

    // Handle app termination event
    BackgroundGeolocation.onTerminate(() => {
      console.log('[terminate] - Goodbye!');
    });

    // Remove listeners when the component is unmounted
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
      BackgroundGeolocation.removeListeners();
    };
  }, []);

  const _handleAppStateChange = nextAppState => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      // The app is in the foreground
    } else if (nextAppState === 'background') {
      console.log('App has gone to the background!');
      // The app is in the background
    }
    setAppState(nextAppState);
  };

  return null; // This component does not render anything
};

export default LocationTracker;
