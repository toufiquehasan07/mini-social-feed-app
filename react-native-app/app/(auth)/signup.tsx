import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import PrimaryButton from "../../components/PrimaryButton";
import { Colors, FontSize, Spacing } from "../../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import { isLoading, signupThunk } from "@/store/authSlice";

const SignupScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch<any>();

  const loading = useSelector(isLoading);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit =
    !!name &&
    !!username &&
    !!email &&
    !!password &&
    !loading;

  const handleSignup = async () => {
    if (!canSubmit) return;

    try {
      const message = await dispatch(
        signupThunk({
          name,
          username,
          email,
          password,
        })
      ).unwrap();

      Alert.alert(
        "Registration Successful",
        message || "Your account has been created successfully. Please login.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error || "Something went wrong."
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <Feather name="chevron-left" size={22} color={Colors.text3} />
          </Pressable>

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>Join SocialFeed today</Text>
            </View>
          </View>

          <View style={{ gap: Spacing.lg }}>
            <FormField
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Dong Lee"
            />
            <FormField
              label="Username"
              value={username}
              onChangeText={(v) => setUsername(v.toLowerCase().replace(/\s/g, ""))}
              placeholder="lee"
              prefix="@"
              autoCapitalize="none"
            />
            <FormField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 6 characters"
              secureTextEntry
              onSubmitEditing={handleSignup}
            />
          </View>

          <PrimaryButton
            label={loading ? "Creating account…" : "Create Account"}
            onPress={handleSignup}
            disabled={!canSubmit}
            loading={loading}
            style={{ marginTop: Spacing.xxl }}
          />

          <Text style={styles.terms}>
            By continuing you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.footerLink}>Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default SignupScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surface
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl
  },
  backBtn: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignSelf: "flex-start"
  },
  headerRow: {
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xxl
  },
  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: "700",
    color: Colors.text
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.text3
  },
  terms: {
    marginTop: Spacing.md,
    textAlign: "center",
    fontSize: FontSize.sm,
    lineHeight: 18,
    color: Colors.text4
  },
  termsLink: {
    color: Colors.primary
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    paddingTop: Spacing.xxl
  },
  footerText: {
    fontSize: FontSize.md,
    color: Colors.text3
  },
  footerLink: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.primary
  },
});
