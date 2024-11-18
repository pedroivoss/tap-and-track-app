import { Link, Tabs } from 'expo-router';

import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';

//https://flatuicolors.com/palette/us

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Register',
          tabBarIcon: ({ color }) => <TabBarIcon name="clock-o" color={color} />,
          /*headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),*/
        }}
      />

      <Tabs.Screen
        name="list"
        options={{
          title: 'list',
          tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
