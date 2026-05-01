import { ApiClientError, createPublicOrder, type DeliveryMode, type PublicOrder } from '@acme/api-client';
import { getCartCount } from '@acme/cart';
import { brandColors } from '@acme/shared';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { useCart } from './cart/use-cart';
import { Screen } from './components/screen';

type CheckoutScreenProps = {
  onBack: () => void;
  onSuccess: (order: PublicOrder) => void;
};

type FormErrors = {
  address?: string;
  name?: string;
  phone?: string;
  scheduledAt?: string;
};

type FormState = {
  address: string;
  deliveryMode: DeliveryMode;
  email: string;
  name: string;
  phone: string;
  scheduledAt: string;
};

const initialFormState: FormState = {
  address: '',
  deliveryMode: 'instant',
  email: '',
  name: '',
  phone: '',
  scheduledAt: ''
};

const getScheduledAtIsoString = (value: string) => {
  if (Number.isNaN(Date.parse(value))) {
    return null;
  }

  return new Date(value).toISOString();
};

export function CheckoutScreen({ onBack, onSuccess }: CheckoutScreenProps) {
  const { state } = useCart();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const itemCount = getCartCount(state);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value
    }));

    if (field === 'deliveryMode') {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        scheduledAt: undefined
      }));
      return;
    }

    if (field in fieldErrors) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined
      }));
    }
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    const trimmedName = formState.name.trim();
    const trimmedPhone = formState.phone.trim();
    const trimmedAddress = formState.address.trim();
    const trimmedScheduledAt = formState.scheduledAt.trim();

    if (trimmedName.length === 0) {
      nextErrors.name = 'Name is required.';
    }

    if (trimmedPhone.length === 0) {
      nextErrors.phone = 'Phone number is required.';
    }

    if (trimmedAddress.length === 0) {
      nextErrors.address = 'Delivery address is required.';
    }

    if (formState.deliveryMode === 'scheduled') {
      if (trimmedScheduledAt.length === 0) {
        nextErrors.scheduledAt = 'Scheduled date and time is required.';
      } else if (getScheduledAtIsoString(trimmedScheduledAt) === null) {
        nextErrors.scheduledAt = 'Enter a valid date/time in the format YYYY-MM-DDTHH:mm.';
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setSubmitError(null);

    if (!validate()) {
      return;
    }

    const trimmedScheduledAt = formState.scheduledAt.trim();
    const scheduledAtIsoString =
      formState.deliveryMode === 'scheduled' ? getScheduledAtIsoString(trimmedScheduledAt) : undefined;

    if (formState.deliveryMode === 'scheduled' && scheduledAtIsoString === null) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        scheduledAt: 'Enter a valid date/time in the format YYYY-MM-DDTHH:mm.'
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createPublicOrder({
        deliveryMode: formState.deliveryMode,
        guest: {
          address: formState.address.trim(),
          email: formState.email.trim() || undefined,
          name: formState.name.trim(),
          phone: formState.phone.trim()
        },
        items: state.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        scheduledAt: scheduledAtIsoString ?? undefined
      });

      onSuccess(order);
    } catch (error) {
      if (error instanceof ApiClientError && typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
        setSubmitError(error.message || 'Please check your details and try again.');
      } else {
        setSubmitError("Couldn't reach our servers. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <View style={styles.screen}>
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back" disabled={isSubmitting} onPress={onBack} style={styles.iconButton}>
              <Ionicons color={brandColors.black} name="arrow-back" size={20} />
            </Pressable>

            <Text style={styles.headerTitle}>Guest checkout</Text>

            <View style={styles.headerSpacer} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.summaryCard}>
              <Text style={styles.sectionEyebrow}>Order</Text>
              <Text style={styles.sectionTitle}>Almost there</Text>
              <Text style={styles.summaryText}>
                You&apos;re placing an order for {itemCount} item{itemCount === 1 ? '' : 's'} as a guest.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionEyebrow}>Your details</Text>
              <Text style={styles.sectionTitle}>Delivery information</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full name</Text>
                <TextInput
                  autoCapitalize="words"
                  autoComplete="name"
                  editable={!isSubmitting}
                  onChangeText={(value) => handleChange('name', value)}
                  placeholder="Jane Doe"
                  style={[styles.input, fieldErrors.name ? styles.inputError : null]}
                  value={formState.name}
                />
                {fieldErrors.name ? <Text style={styles.errorText}>{fieldErrors.name}</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Phone number</Text>
                <TextInput
                  autoComplete="tel"
                  editable={!isSubmitting}
                  keyboardType="phone-pad"
                  onChangeText={(value) => handleChange('phone', value)}
                  placeholder="+1 555 000 0000"
                  style={[styles.input, fieldErrors.phone ? styles.inputError : null]}
                  value={formState.phone}
                />
                {fieldErrors.phone ? <Text style={styles.errorText}>{fieldErrors.phone}</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Delivery address</Text>
                <TextInput
                  autoCapitalize="sentences"
                  editable={!isSubmitting}
                  multiline
                  onChangeText={(value) => handleChange('address', value)}
                  placeholder="House number, street, area"
                  style={[styles.input, styles.multilineInput, fieldErrors.address ? styles.inputError : null]}
                  textAlignVertical="top"
                  value={formState.address}
                />
                {fieldErrors.address ? <Text style={styles.errorText}>{fieldErrors.address}</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email (optional)</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!isSubmitting}
                  keyboardType="email-address"
                  onChangeText={(value) => handleChange('email', value)}
                  placeholder="jane@example.com"
                  style={styles.input}
                  value={formState.email}
                />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionEyebrow}>Delivery mode</Text>
              <Text style={styles.sectionTitle}>When should we deliver?</Text>

              <View style={styles.toggleRow}>
                <Pressable
                  disabled={isSubmitting}
                  onPress={() => handleChange('deliveryMode', 'instant')}
                  style={[styles.toggleButton, formState.deliveryMode === 'instant' ? styles.toggleButtonActive : null]}
                >
                  <Text style={[styles.toggleButtonText, formState.deliveryMode === 'instant' ? styles.toggleButtonTextActive : null]}>
                    Instant
                  </Text>
                </Pressable>

                <Pressable
                  disabled={isSubmitting}
                  onPress={() => handleChange('deliveryMode', 'scheduled')}
                  style={[styles.toggleButton, formState.deliveryMode === 'scheduled' ? styles.toggleButtonActive : null]}
                >
                  <Text style={[styles.toggleButtonText, formState.deliveryMode === 'scheduled' ? styles.toggleButtonTextActive : null]}>
                    Scheduled
                  </Text>
                </Pressable>
              </View>

              {formState.deliveryMode === 'scheduled' ? (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Scheduled date/time</Text>
                  <TextInput
                    autoCapitalize="none"
                    editable={!isSubmitting}
                    onChangeText={(value) => handleChange('scheduledAt', value)}
                    placeholder="YYYY-MM-DDTHH:mm"
                    style={[styles.input, fieldErrors.scheduledAt ? styles.inputError : null]}
                    value={formState.scheduledAt}
                  />
                  <Text style={styles.helperText}>Enter date/time in your local timezone - we&apos;ll convert to UTC</Text>
                  {fieldErrors.scheduledAt ? <Text style={styles.errorText}>{fieldErrors.scheduledAt}</Text> : null}
                </View>
              ) : null}
            </View>

            {submitError ? (
              <View style={styles.submitErrorCard}>
                <Text style={styles.submitErrorText}>{submitError}</Text>
              </View>
            ) : null}

            <Pressable disabled={isSubmitting} onPress={handleSubmit} style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}>
              {isSubmitting ? <ActivityIndicator color={brandColors.white} size="small" /> : <Text style={styles.submitButtonText}>Place order</Text>}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1
  },
  screen: {
    backgroundColor: '#f7f5f1',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 18
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: brandColors.white,
    borderColor: '#e7e5e4',
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  headerTitle: {
    color: brandColors.black,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center'
  },
  headerSpacer: {
    width: 44
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 28
  },
  summaryCard: {
    backgroundColor: '#fbf7f1',
    borderColor: '#eee7db',
    borderRadius: 24,
    borderWidth: 1,
    gap: 4,
    padding: 18
  },
  card: {
    backgroundColor: brandColors.white,
    borderColor: '#e7e5e4',
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    padding: 18
  },
  sectionEyebrow: {
    color: '#9c6b2f',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase'
  },
  sectionTitle: {
    color: brandColors.black,
    fontSize: 22,
    fontWeight: '700'
  },
  summaryText: {
    color: '#6d6255',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4
  },
  fieldGroup: {
    gap: 8
  },
  label: {
    color: '#4b4238',
    fontSize: 14,
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#fdfcf9',
    borderColor: '#ddd6cb',
    borderRadius: 18,
    borderWidth: 1,
    color: brandColors.black,
    fontSize: 15,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  multilineInput: {
    minHeight: 92
  },
  inputError: {
    borderColor: '#dc2626'
  },
  helperText: {
    color: '#6d6255',
    fontSize: 12,
    lineHeight: 18
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    lineHeight: 18
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10
  },
  toggleButton: {
    alignItems: 'center',
    backgroundColor: '#f7f5f1',
    borderColor: '#ddd6cb',
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  toggleButtonActive: {
    backgroundColor: brandColors.logoGreen,
    borderColor: brandColors.logoGreen
  },
  toggleButtonText: {
    color: brandColors.black,
    fontSize: 14,
    fontWeight: '700'
  },
  toggleButtonTextActive: {
    color: brandColors.white
  },
  submitErrorCard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  submitErrorText: {
    color: '#b91c1c',
    fontSize: 14,
    lineHeight: 20
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: brandColors.logoGreen,
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  submitButtonDisabled: {
    opacity: 0.6
  },
  submitButtonText: {
    color: brandColors.white,
    fontSize: 15,
    fontWeight: '700'
  }
});
