import {createStackNavigator} from '@react-navigation/stack';
import Home from '../src/Home';
import {NavigationContainer} from '@react-navigation/native';

function AppStackNavigator(props) {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // You can customize your header options here
        }}>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default AppStackNavigator;
