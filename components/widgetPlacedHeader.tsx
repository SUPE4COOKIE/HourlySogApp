import { View, StyleSheet, Text } from "react-native";

const WidgetPlacedHeader = ({ hasWidget }: { hasWidget: boolean }) => {
  if (hasWidget) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      padding: 12,
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      borderColor: '#991b1b',
      borderWidth: 1,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      color: '#fca5a5',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    description: {
      color: '#fecaca',
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Widget Not Placed!</Text>
      <Text style={styles.description}>
        To see your hourly soggy cats, go to your home screen, long-press on an empty space, tap "Widgets", and add the Hourly Soggy Cat widget.    
      </Text>
    </View>
  );
}

export default WidgetPlacedHeader;