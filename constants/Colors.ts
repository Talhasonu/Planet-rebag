/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primaryGreen: "#79AA00",
    greenText: "#526D00",
    grayText: "#777777",
    lightgrayText: "#A3A3A3",
    titleText: "#1E252B",
    white: "#FFFFFF",
    white40: "rgba(255,255,255,0.4)",
    borderColor: "#F8F8F8",
    cardBg: "rgba(191, 28, 34, 0.1)",
    green40: "rgba(121, 170, 0, 0.3)", // Added color for green 40
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primaryGreen: "#79AA00",
    appreanve40: "rgba(255, 255, 255, 0.4)", // Added color for appreanve 40
  },
};
