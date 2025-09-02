/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#266041';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1f1f1f',
    background: '#fff',
    secondaryBackground: '#f7f7f7',
    tint: tintColorLight,
    icon: '#a0a0a0',
    tabIconDefault: '#a0a0a0',
    tabIconSelected: '#266041',
    primary: '#266041',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
