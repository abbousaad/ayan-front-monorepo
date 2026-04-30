import { brandColors } from '@acme/shared';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type AuthChoiceModalProps = {
  visible: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
};

export function AuthChoiceModal({ visible, onClose, onContinueAsGuest }: AuthChoiceModalProps) {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable onPress={onClose} style={styles.backdrop} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.title}>How do you want to continue?</Text>
              <Text style={styles.subtitle}>You don&apos;t need an account to place an order.</Text>
            </View>

            <Pressable accessibilityLabel="Close modal" onPress={onClose} style={styles.closeButton}>
              <Ionicons color={brandColors.black} name="close" size={20} />
            </Pressable>
          </View>

          <View style={styles.actions}>
            <Pressable onPress={onContinueAsGuest} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Continue as guest</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Alert.alert('Coming soon', 'Login & sign-up will be available in a future update.');
              }}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Login / Sign up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(24, 16, 8, 0.38)',
    flex: 1,
    justifyContent: 'flex-end'
  },
  backdrop: {
    flex: 1
  },
  sheet: {
    backgroundColor: brandColors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 20
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between'
  },
  headerTextBlock: {
    flex: 1,
    gap: 6,
    paddingTop: 6
  },
  title: {
    color: brandColors.black,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28
  },
  subtitle: {
    color: '#6d6255',
    fontSize: 14,
    lineHeight: 20
  },
  closeButton: {
    alignItems: 'center',
    borderColor: '#e7e5e4',
    borderRadius: 999,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  actions: {
    gap: 12
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: brandColors.logoGreen,
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  primaryButtonText: {
    color: brandColors.white,
    fontSize: 15,
    fontWeight: '700'
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: brandColors.white,
    borderColor: '#d6d3d1',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  secondaryButtonText: {
    color: brandColors.black,
    fontSize: 15,
    fontWeight: '700'
  }
});
