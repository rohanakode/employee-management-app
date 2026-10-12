import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  DEPARTMENTS,
  EmployeeFormValues,
  employeeFormSchema,
} from '../schemas/employeeSchema';
import FormField from './FormField';
import OptionPicker from './OptionPicker';

// ─── PROPS ─────────────────────────────────────────────────────────
// `initialValues` lets us pre-fill the form for Edit, blank for Add.
// `submitLabel` lets Add show "Save employee" and Edit show "Update".
// `onSubmit` is the parent-supplied save handler.
type Props = {
  initialValues?: Partial<EmployeeFormValues>;
  submitLabel: string;
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel: () => void;
};

export default function EmployeeForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      email: initialValues?.email ?? '',
      phone: initialValues?.phone ?? '',
      position: initialValues?.position ?? '',
      department: initialValues?.department,  // undefined if not provided → user must pick
      status: initialValues?.status ?? 'Active',
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormField
              label="Full name"
              icon="person-outline"
              placeholder="e.g. Rohan Akode"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormField
              label="Email"
              icon="mail-outline"
              placeholder="name@company.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormField
              label="Phone"
              icon="call-outline"
              placeholder="10-digit number"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phone?.message}
              keyboardType="phone-pad"
              autoCapitalize="none"
              maxLength={10}
            />
          )}
        />

        <Controller
          control={control}
          name="position"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormField
              label="Position"
              icon="briefcase-outline"
              placeholder="e.g. Software Engineer"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.position?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="department"
          render={({ field: { value, onChange } }) => (
            <OptionPicker
              label="Department"
              options={DEPARTMENTS}
              value={value}
              onChange={onChange}
              error={errors.department?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field: { value, onChange } }) => (
            <OptionPicker
              label="Status"
              options={['Active', 'Inactive'] as const}
              value={value}
              onChange={onChange}
              error={errors.status?.message}
            />
          )}
        />

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]}
            onPress={onCancel}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              (pressed || isSubmitting) && styles.btnPressed,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.saveBtnText}>
              {isSubmitting ? 'Saving…' : submitLabel}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#525252',
    fontWeight: '600',
    fontSize: 15,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: '#ea580c',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  btnPressed: {
    opacity: 0.85,
  },
});
