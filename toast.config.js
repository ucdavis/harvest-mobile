
import { BaseToast } from 'react-native-toast-message';
import { Colors } from './constants/Colors';

const base = {
  style: { borderRadius: 2, marginHorizontal: 14 },
  contentContainerStyle: { paddingHorizontal: 14 },
  text1Style: { fontSize: 16, fontWeight: '600', color: '#1f1f1f' }, // slate-900
};

export const toastConfig = {

  success: (props) => (
    <BaseToast
      {...props}
      {...base}
      style={[base.style, { borderLeftColor: Colors.toastInfoBorder, backgroundColor: Colors.toastInfoBg }]}
    />
  ),


  warning: (props) => (
    <BaseToast
      {...props}
      {...base}
      style={[base.style, { borderLeftColor: Colors.toastWarningBorder, backgroundColor: Colors.toastWarningBg }]}
    />
  ),


  danger: (props) => (
    <BaseToast
      {...props}
      {...base}
      style={[base.style, { borderLeftColor: Colors.toastDangerBorder, backgroundColor: Colors.toastDangerBg }]}

    />
  ),
};
