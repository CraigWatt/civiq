import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>civiq</Text>
      <Text style={styles.title}>Congress trade tracking, simplified.</Text>
      <Text style={styles.body}>
        Official filings, percentage context, and user-directed execution in one
        app.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#08121f"
  },
  kicker: {
    color: "#7dd3fc",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12
  },
  title: {
    color: "#f8fafc",
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12
  },
  body: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 320
  }
});

