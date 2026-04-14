import React from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';

interface LogoProps {
  containerStyle?: ViewStyle;
}

export default function Logo({ containerStyle }: LogoProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={require('@/assets/logo.png')}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 70,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
