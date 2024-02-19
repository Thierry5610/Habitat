import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import SignUp from "./Signup";
import ResetPassword from "./ResetPassword";

export default function LoginScreen() {
    const Stack = createNativeStackNavigator()
    return(
        <>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Login"
                >
                    <Stack.Screen
                        component={Login}
                        name="Login"
                        options={{headerShown:false}}
                    />
                <Stack.Screen
                        component={SignUp}
                        name="SignUP"
                        options={{headerShown:false}}
                    />
                <Stack.Screen
                        component={ResetPassword}
                        name="Reset"
                        options={{headerShown:false}}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}