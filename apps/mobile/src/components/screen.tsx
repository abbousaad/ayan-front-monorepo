import { brandColors } from '@acme/shared';
import { type ReactNode } from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';

type ScreenProps = {
  children: ReactNode;
};

export function Screen({ children }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: brandColors.white,
    flex: 1
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 8 : 0
  }
});
