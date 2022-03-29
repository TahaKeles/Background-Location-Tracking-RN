import {createStackNavigator} from '@react-navigation/stack';
import {Homepage} from './pages/Homepage';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Homepage" component={Homepage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
