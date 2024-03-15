import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';



export default function Loading () {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="small" color="#333" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
    padding: 10,
  },
});

 