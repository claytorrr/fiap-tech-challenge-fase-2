import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import EditPostScreen from '../screens/EditPostScreen';
import AdminPostsScreen from '../screens/AdminPostsScreen';
import TeacherListScreen from '../screens/teachers/TeacherListScreen';
import CreateTeacherScreen from '../screens/teachers/CreateTeacherScreen';
import EditTeacherScreen from '../screens/teachers/EditTeacherScreen';
import StudentListScreen from '../screens/students/StudentListScreen';
import CreateStudentScreen from '../screens/students/CreateStudentScreen';
import EditStudentScreen from '../screens/students/EditStudentScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HEADER_STYLE = {
  headerStyle: { backgroundColor: '#2563EB' },
  headerTintColor: '#FFF',
  headerTitleStyle: { fontWeight: 'bold' },
};

function LogoutButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 12 }}>
      <Ionicons name="log-out-outline" size={24} color="#FFF" />
    </TouchableOpacity>
  );
}

function HomeStack() {
  const { logout } = useAuth();
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Blog FIAP',
          headerRight: () => <LogoutButton onPress={logout} />,
        }}
      />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post' }} />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen name="AdminPosts" component={AdminPostsScreen} options={{ title: 'Gerenciar Posts' }} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Novo Post' }} />
      <Stack.Screen name="EditPost" component={EditPostScreen} options={{ title: 'Editar Post' }} />
    </Stack.Navigator>
  );
}

function TeachersStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen name="TeacherList" component={TeacherListScreen} options={{ title: 'Professores' }} />
      <Stack.Screen name="CreateTeacher" component={CreateTeacherScreen} options={{ title: 'Novo Professor' }} />
      <Stack.Screen name="EditTeacher" component={EditTeacherScreen} options={{ title: 'Editar Professor' }} />
    </Stack.Navigator>
  );
}

function StudentsStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen name="StudentList" component={StudentListScreen} options={{ title: 'Alunos' }} />
      <Stack.Screen name="CreateStudent" component={CreateStudentScreen} options={{ title: 'Novo Aluno' }} />
      <Stack.Screen name="EditStudent" component={EditStudentScreen} options={{ title: 'Editar Aluno' }} />
    </Stack.Navigator>
  );
}

function TeacherTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIcon: ({ color, size }) => {
          const icons = {
            PostsTab: 'newspaper-outline',
            AdminTab: 'settings-outline',
            TeachersTab: 'school-outline',
            StudentsTab: 'people-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="PostsTab"
        component={HomeStack}
        options={{ title: 'Posts' }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('PostsTab', { screen: 'Home' });
          },
        })}
      />
      <Tab.Screen name="AdminTab" component={AdminStack} options={{ title: 'Admin' }} />
      <Tab.Screen name="TeachersTab" component={TeachersStack} options={{ title: 'Professores' }} />
      <Tab.Screen name="StudentsTab" component={StudentsStack} options={{ title: 'Alunos' }} />
    </Tab.Navigator>
  );
}

function StudentTabs() {
  const { logout } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
      }}
    >
      <Tab.Screen
        name="PostsTab"
        component={HomeStack}
        options={{
          title: 'Posts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('PostsTab', { screen: 'Home' });
          },
        })}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user.role === 'teacher' ? (
          <Stack.Screen name="TeacherMain" component={TeacherTabs} />
        ) : (
          <Stack.Screen name="StudentMain" component={StudentTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
