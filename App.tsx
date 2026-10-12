import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { EmployeesProvider } from './src/context/EmployeesContext';
import type { RootStackParamList } from './src/navigation/types';
import AddEmployeeScreen from './src/screens/AddEmployeeScreen';
import EditEmployeeScreen from './src/screens/EditEmployeeScreen';
import EmployeeDetailScreen from './src/screens/EmployeeDetailScreen';
import EmployeeListScreen from './src/screens/EmployeeListScreen';

// Create a typed stack navigator. The generic locks our screen names
// to the RootStackParamList, so a typo in `name="EmployeeList"` becomes a TS error.
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // EmployeesProvider makes the employee list + CRUD functions
    // available to EVERY screen inside the navigator.
    <EmployeesProvider>
      {/* NavigationContainer is required once at the root — it manages
          the navigation state tree, back button, deep links, etc. */}
      <NavigationContainer>
        <StatusBar style="dark" />

        {/* Stack.Navigator is a native-stack (uses iOS/Android's native
            screen-stack animation — slide in from right, back arrow,
            hardware back button, etc.) */}
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#fafafa' },
            headerTitleStyle: { fontWeight: '700', color: '#0a0a0a' },
            headerTintColor: '#ea580c',  // back arrow + button color
            headerShadowVisible: false,  // flat header, no bottom border
            contentStyle: { backgroundColor: '#fafafa' },
          }}
        >
          <Stack.Screen
            name="EmployeeList"
            component={EmployeeListScreen}
            options={{ title: 'Employee Management' }}
          />
          <Stack.Screen
            name="EmployeeDetail"
            component={EmployeeDetailScreen}
            options={{ title: 'Details' }}
          />
          <Stack.Screen
            name="AddEmployee"
            component={AddEmployeeScreen}
            options={{ title: 'Add Employee' }}
          />
          <Stack.Screen
            name="EditEmployee"
            component={EditEmployeeScreen}
            options={{ title: 'Edit Employee' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </EmployeesProvider>
  );
}
