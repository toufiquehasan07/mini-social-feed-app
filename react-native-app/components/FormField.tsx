import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { Colors, FontSize, Radius, Spacing } from "../constants/theme";

interface FormFieldProps extends TextInputProps {
  label: string;
  prefix?: string;
  style?: any
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  prefix,
  style,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: focused ? Colors.inputBgFocus : Colors.inputBg, borderColor: focused ? Colors.primary : Colors.border },
        ]}
      >
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          {...inputProps}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          placeholderTextColor={Colors.text3}
          style={styles.input}
        />
      </View>
    </View>
  );
}

export default FormField;

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: Colors.text3,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
  },
  prefix: {
    fontSize: FontSize.lg,
    color: Colors.text3,
    marginRight: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
});
