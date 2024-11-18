import { Link, Tabs } from 'expo-router';

import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';

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
          tabBarIcon: ({ color }) => <TabBarIcon /*size={28}*/ name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />

      <Tabs.Screen
        name="historical"
        options={{
          title: 'historical',
          tabBarIcon: ({ color }) => <TabBarIcon name="contao" color={color} />,
        }}
      />

      <Tabs.Screen
        name="two"
        options={{
          title: 'Config',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
