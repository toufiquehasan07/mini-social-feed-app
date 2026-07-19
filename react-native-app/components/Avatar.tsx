import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { User } from "../types";
import { Gradients } from "@/constants/theme";

const SIZES = {
  sm: { box: 32, font: 12 },
  md: { box: 40, font: 15 },
  lg: { box: 56, font: 20 },
};

const getInitials = (name?: string) => {
  if (!name) return "UN";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

interface AvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

const Avatar = ({
  user,
  size = "md",
}: AvatarProps) => {
  const { box, font } = SIZES[size];

  return (
    <LinearGradient
      colors={Gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.avatar,
        {
          width: box,
          height: box,
          borderRadius: box / 2,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: font }]}>
        {getInitials(user?.name)}
      </Text>
    </LinearGradient>
  );
}

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  initials: {
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});