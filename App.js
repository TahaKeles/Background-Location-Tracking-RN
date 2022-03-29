import {createStackNavigator} from '@react-navigation/stack';
import {Homepage} from './pages/Homepage';
import {Trippage} from './pages/Trippage';

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Homepage"
          component={Homepage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Trippage"
          component={Trippage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
